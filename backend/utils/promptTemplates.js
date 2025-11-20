// Prompt templates for AI content generation

export const promptTemplates = {
  generateCaption: (idea, platform, tone) => {
    return `Generate a compelling social media caption for ${platform} based on this idea: "${idea}"

Requirements:
- Tone: ${tone}
- Platform: ${platform}
- Make it engaging and appropriate for the platform
- Include relevant hashtags if applicable
- Keep it concise but impactful

Generate the caption:`;
  },

  generateScript: (idea, platform, tone) => {
    const platformGuidelines = {
      youtube: 'Create a detailed script with hook, main content, and call-to-action. Length: 3-5 minutes.',
      tiktok: 'Create a short, punchy script with a strong hook. Length: 15-60 seconds. Include visual cues.',
      twitter: 'Create a thread script with engaging points. Keep it concise.',
      instagram: 'Create a script for Instagram Reels or Stories. Include visual cues.',
      linkedin: 'Create a professional script suitable for LinkedIn video content.',
    };

    return `Generate a video script for ${platform} based on this idea: "${idea}"

Requirements:
- Tone: ${tone}
- Platform: ${platform}
${platformGuidelines[platform] || ''}
- Make it engaging and keep viewers hooked
- Include a clear call-to-action

Generate the script:`;
  },

  generateSchedule: (niche, platform) => {
    return `As a social media expert, suggest the best posting schedule for a ${niche} creator on ${platform}.

Provide:
1. Optimal posting times (days and times)
2. Recommended posting frequency
3. Best days of the week
4. Timezone considerations
5. Brief explanation for each recommendation

Format your response clearly with specific times and reasoning.`;
  },

  generateIdeas: (niche, count = 10) => {
    return `Generate ${count} creative and engaging content ideas for a ${niche} creator.

Requirements:
- Ideas should be specific and actionable
- Mix of different content types (educational, entertaining, behind-the-scenes, etc.)
- Ideas should be relevant to the ${niche} niche
- Each idea should be 1-2 sentences

Format as a numbered list.`;
  },

  rewriteContent: (content, tone, platform) => {
    return `Rewrite the following content in a ${tone} tone, optimized for ${platform}:

Original content:
"${content}"

Requirements:
- Maintain the core message
- Adjust tone to be ${tone}
- Optimize for ${platform} platform
- Keep it engaging and authentic

Rewritten content:`;
  },
};

