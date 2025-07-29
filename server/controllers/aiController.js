import OpenAI from "openai";
import sql from "../configs/db.js";
import { clerkClient, clerkMiddleware } from "@clerk/express";
import axios from "axios";
import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';
import pdf from 'pdf-parse/lib/pdf-parse.js';
import FormData from 'form-data';
import dotenv from 'dotenv';
dotenv.config();


const AI = new OpenAI({
    apiKey: process.env.GEMINI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

export const generateArticle = async (req, res) => {
  try{
     const { userId } = req.auth();
     const { prompt, length } = req.body;
     const plan = req.plan;
     const free_usage = req.free_usage;

     if(plan !== 'premium' && free_usage >= 10) {
       return res.json({success: false, message: "Free usage limit exceeded. Upgrade to premium for more requests."});
     }

    const response = await AI.chat.completions.create({
    model: "gemini-2.0-flash",
    messages: [{
        role: "user",
        content: prompt,
    }],
    temperature: 0.7,
    max_tokens: length,
});

console.log("OpenAI Response:", response); // Log the response

    const content = response.choices[0].message.content;

    await sql`INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId}, ${prompt}, ${content}, 'article')`;

    if(plan !== 'premium') {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          free_usage: free_usage + 1
        }
      });
    }
   res.json({success: true, content});

  } catch(error) {
    console.log(error.message)
    res.json({success: false, error: error.message});
  }
}


export const generateBlogTitle = async (req, res) => {
  try{
     const { userId } = req.auth();
     const { prompt } = req.body;
     const plan = req.plan;
     const free_usage = req.free_usage;

     if(plan !== 'premium' && free_usage >= 10) {
       return res.json({success: false, message: "Free usage limit exceeded. Upgrade to premium for more requests."})
     }

    const response = await AI.chat.completions.create({
    model: "gemini-2.0-flash",
    messages: [{role: "user",content: prompt,} ],
    temperature: 0.7,
    max_tokens: 100,
});

    const content = response.choices[0].message.content

    await sql` INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId}, ${prompt}, ${content}, 'blog-title')`;

    if(plan !== 'premium') {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          free_usage: free_usage + 1
        }
      })
    }
   res.json({success: true, content})

  } catch(error) {
    console.log(error.message)
    res.json({success: false, message: error.message});
  }
}




export const generateImage = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { prompt, publish } = req.body;
    const plan = req.plan;
    console.log('ClipDrop Key:', process.env.CLIPDROP_API_KEY);


    // Plan check
    if (plan !== 'premium') {
      return res.json({
        success: false,
        message: 'This feature is only available to premium users. Upgrade to premium to use this feature.',
      });
    }

    // Prompt validation
    if (!prompt || typeof prompt !== 'string' || prompt.trim() === '') {
      return res.json({ success: false, message: 'Prompt is required and must be a non-empty string.' });
    }

    // API key check
    if (!process.env.CLIPDROP_API_KEY) {
      throw new Error('CLIPDROP_API_KEY not set.');
    }

    // Build and send form data
    const formData = new FormData();
    formData.append('prompt', prompt);

    const { data } = await axios.post(
      'https://clipdrop-api.co/text-to-image/v1',
      formData,
      {
        headers: {
          'x-api-key': process.env.CLIPDROP_API_KEY,
          ...formData.getHeaders(),
        },
        responseType: 'arraybuffer',
      }
    );

    // Convert binary image to base64
    const base64Image = `data:image/png;base64,${Buffer.from(data, 'binary').toString('base64')}`;

    // Upload to Cloudinary
    const { secure_url } = await cloudinary.uploader.upload(base64Image);
    if (!secure_url) {
      throw new Error('Cloudinary upload failed.');
    }

    // Fallback for `publish`
    const isPublic = typeof publish === 'boolean' ? publish : false;

    // Insert into DB
    await sql`
      INSERT INTO creations (user_id, prompt, content, type, publish)
      VALUES (${userId}, ${prompt}, ${secure_url}, 'image', ${isPublic})
    `;

    // Response
    res.json({ success: true, content: secure_url });

  } catch (error) {
    console.error('Image generation error:', error.response?.data || error.message);
    res.json({ success: false, message: error.message || 'Unknown error occurred.' });
  }
};





export const removeImageBackground = async (req, res)=>{
  try {
    const { userId } = req.auth();
    const image = req.file;
    const plan = req.plan;
    if(plan !== 'premium'){
      return res.json({ success: false, message: "This feature is only available for premium subscriptions"})
    }
    const {secure_url} = await cloudinary.uploader.upload(image.path, {
      transformation: [
        {
          effect: 'background_removal',
          background_removal: 'remove_the_background'
        }
      ]
    })

    await sql`INSERT INTO creations (user_id, prompt, content, type)
     VALUES (${userId}, 'Remove background from image', ${secure_url}, 'image')`;
     res.json({ success: true, content: secure_url})

     } catch (error) {
      console.log(error.message)
     res.json({success: false, message: error.message})
  }
}






export const removeImageObject = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { object } = req.body;
    const image = req.file;
    const plan = req.plan;

    if (plan !== 'premium') {
      return res.json({
        success: false,
        message: 'This feature is only available to premium users. Upgrade to premium to use this feature.',
      });
    }

    if (!image || !object) {
      return res.json({ success: false, message: 'Image file and object name are required.' });
    }

    const { public_id } = await cloudinary.uploader.upload(image.path);

    const imageUrl = cloudinary.url(public_id, {
      transformation: [{ effect: `gen_remove:${object}` }],
      resource_type: 'image',
    });

    await sql`
      INSERT INTO creations (user_id, prompt, content, type)
      VALUES (${userId}, ${`Removed ${object} from image`}, ${imageUrl}, 'image')
    `;

    res.json({ success: true, content: imageUrl });
  } catch (error) {
    console.error('Remove object error:', error.message);
    res.json({ success: false, message: error.message });
  }
};




export const resumeReview = async (req, res) => {
  try{
     const { userId } = req.auth();
     const resume = req.file;
     const plan = req.plan;
    
     if(plan !== 'premium') {
       return res.json({success: false, message: "This feature is only available to premium users. Upgrade to premium to use this feature."})
     }
     
    if(resume.size > 5 * 1024 * 1024) {
      return res.json({success: false, message: "Resume file size exceeds 5MB limit."});
    }

    const dataBuffer = fs.readFileSync(resume.path);
    const pdfData = await pdf(dataBuffer);

    const prompt = `review this resume and provide constructive feedback on its strengths, weaknesses and areas for improvement. Resume content: \n\n${pdfData.text}`;

     const response = await AI.chat.completions.create({
    model: "gemini-2.0-flash",
    messages: [{role: "user",content: prompt,} ],
    temperature: 0.7,
    max_tokens: 2000,
   });

    const content = response.choices[0].message.content

    await sql` INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId}, 'Review the uploaded resume', ${content}, 'resume-review')`;

   res.json({success: true, content});
  } catch(error) {
    console.log(error.message)
    res.json({success: false, message: error.message});
  }
}