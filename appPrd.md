# Product Requirements Document (PRD)

## 1. Overview

We are creating a **Contentful App** that appears as a **dedicated page** (via the Page location in the App Framework). This page will enable users to:

1. **Enter an Initial Prompt** (e.g., “A calm forest with a surreal glow”).
2. **Generate an Optimized Image Prompt** by passing the user’s prompt through a **Hugging Face text model** (for prompt optimization or style suggestions).
3. **Use the Optimized Prompt** to call a **Hugging Face image model**, returning **one generated image**.
4. **Preview & Iterate** on the output:  
   - If the user likes the result, they can **upload the image as a new Contentful asset**.  
   - Otherwise, they can **edit either the initial or the optimized prompt** and re-generate a different image.

This approach ensures a more refined prompt is fed into the image model, resulting in higher-quality or more relevant AI-generated images.

---

## 2. Goals & Objectives

1. **Streamlined Prompt-to-Image Flow**  
   - Provide a single page in Contentful where editors can quickly generate an optimized prompt and produce an AI image.

2. **Improved Image Quality**  
   - Using a text model to refine prompts ensures more relevant and higher-quality images from the image model.

3. **User Choice & Flexibility**  
   - Allow users to revise or override either the initial prompt or the optimized prompt for maximum creative control.

4. **Integrated Asset Management**  
   - Once satisfied, users can seamlessly upload the generated image to Contentful’s asset library, maintaining a consistent workflow.

---

## 3. User Stories

1. **Content Editor**  
   - As a Content Editor, I want to go to the AI Image Generation page, type my initial idea for an image, have the system optimize that idea, then generate an actual image. If I like it, I can finalize and upload it as a new asset in Contentful.  
   - **Acceptance Criteria**:  
     - Page location is accessible from the Contentful UI (e.g., “Apps > AI Image Generation”).  
     - I can see both my original prompt and the text model’s optimized prompt.  
     - I can upload the chosen generated image to Contentful or revise the prompt to try again.

2. **Marketing Manager**  
   - As a Marketing Manager, I want a quick way to produce visually appealing on-brand images without needing a designer for every request, but also want to ensure I can tweak the prompt for brand alignment.  
   - **Acceptance Criteria**:  
     - Prompt refinement helps me achieve a consistent style.  
     - I can easily iterate on the prompt if the image doesn’t match brand guidelines.

3. **Administrator**  
   - As an Administrator, I want to ensure the Hugging Face API keys are stored securely and that only certain roles can access the prompt-to-image feature.  
   - **Acceptance Criteria**:  
     - The tokens for the text and image models are stored in environment variables.  
     - Configuration is locked behind appropriate roles or space permissions.

---

## 4. Scope & Requirements

### 4.1 Functional Requirements

1. **Dedicated Page Location in Contentful**  
   - The app must register a **Page location** so users can click a link in the sidebar or top navigation to access the tool.

2. **Initial Prompt Input**  
   - A text field where users enter a brief description of what they want to see (e.g., “A futuristic city skyline at night”).

3. **Text Model Optimization**  
   - The user’s initial prompt is sent to a Hugging Face text model (e.g., a GPT-like model) that refines it, adding descriptive or stylistic cues specifically for image generation (e.g., “Panoramic view of a futuristic city skyline at night, hyperrealistic style, 4K resolution”).  
   - The optimized prompt is displayed to the user.

4. **Image Generation**  
   - The refined prompt is used by a Hugging Face image model (e.g., Stable Diffusion, DALL·E, etc.) to generate one image.  
   - Present a loading indicator while the image is being created.

5. **Prompt Editing & Regeneration**  
   - The user can edit **either** the original prompt or the optimized prompt (or both), then regenerate the image.  
   - Each regeneration call triggers the text model flow again (if desired) or reuses the existing optimized prompt flow.

6. **Image Review & Asset Upload**  
   - Show the generated image to the user, who can:  
     - **Accept and upload**: Creates a new asset in Contentful’s media library.  
     - **Reject or revise**: Modifies the prompts and triggers a new image generation process.

7. **Publishing**  
   - Provide an option to automatically publish the new asset or leave it in draft mode.

8. **Security**  
   - Hugging Face tokens (for both the text model and the image model) must be stored securely in environment variables.  
   - Access to the page is governed by Contentful roles/permissions.

### 4.2 Non-Functional Requirements

1. **Performance**  
   - The text model and image model calls can be slow; provide clear loading feedback and consider timeouts or retry logic.

2. **Reliability & Error Handling**  
   - If the text model or image model fails (e.g., rate limiting, network issues), display a helpful error message.

3. **Maintainability**  
   - Code should follow the Contentful App Framework standards, with clear separation of the text optimization step and the image generation step.

4. **Scalability**  
   - Support multiple concurrent users and handle potential API rate limits or concurrency restrictions from Hugging Face.

5. **Legal & Licensing**  
   - Comply with the usage terms of the AI models (especially if they have limitations on commercial use or usage volume).

---

## 5. Key Features & Workflow

### 5.1 Proposed User Flow

1. **Navigate to the AI Image Generation Page**  
   - The user selects the app from the “Apps” section in Contentful’s navigation.

2. **Enter Initial Prompt**  
   - The page shows a text field labeled "Describe your image concept"
   - Two action buttons are provided:
     - **"Refine Prompt"**: Sends prompt through text model for optimization
     - **"Generate Image"**: Bypasses refinement and generates image directly

3. **Text Model Prompt Optimization**  
   - The user’s input is sent to the Hugging Face text model.  
   - The app displays a “Refining prompt…” loader.  
   - The result is shown as an “Optimized Prompt for Image Generation.”

4. **Confirm or Edit Optimized Prompt**  
   - The user sees side-by-side fields:  
     - **Original Prompt**  
     - **Optimized Prompt**  
   - The user can either accept the optimized prompt, or further edit either prompt before the image generation step.  
   - A button labeled “Generate Image” triggers the image model API call.

5. **Image Model Call**  
   - The system uses the final prompt (optimized) to call the Hugging Face image model.  
   - A “Generating image…” loader indicates progress.

6. **Preview Generated Image**  
   - Once complete, show the single returned image to the user.  
   - The user can:  
     - **Accept and Upload**: Creates a new content asset in Contentful.  
     - **Edit Prompt & Regenerate**: Goes back to step 4, allowing the user to refine the prompt and generate a new image.

7. **Upload to Contentful**  
   - If the user clicks “Accept,” the app programmatically creates an asset with the generated image, optionally publishes it, and confirms completion to the user.

---

## 6. Technical Approach

1. **Contentful App Framework**  
   - Build with React (or Vanilla JS) and the [App SDK](https://www.contentful.com/developers/docs/extensibility/app-framework/).  
   - Register a **Page Location** so the entire custom UI can live on its own page.

2. **Hugging Face Text Model**  
   - An example might be a Meta Llama 3 or GPT-3.5-like model.  
   - **Request Example**:
     ```js
     const textResponse = await fetch(TEXT_MODEL_ENDPOINT, {
       method: 'POST',
       headers: {
         Authorization: `Bearer ${TEXT_MODEL_TOKEN}`,
         'Content-Type': 'application/json'
       },
       body: JSON.stringify({ inputs: userPrompt })
     });
     const optimizedPrompt = await textResponse.json();
     ```
   - **Output**: A refined prompt string.

3. **Hugging Face Image Model**  
   - Could be Stable Diffusion, DALL·E, Flux, or other Hugging Face-hosted models.  
   - **Request Example**:
     ```js
     const imageResponse = await fetch(IMAGE_MODEL_ENDPOINT, {
       method: 'POST',
       headers: {
         Authorization: `Bearer ${IMAGE_MODEL_TOKEN}`,
         'Content-Type': 'application/json'
       },
       body: JSON.stringify({ inputs: finalPrompt })
     });
     const imageBlob = await imageResponse.blob();
     ```
   - **Output**: Binary data (Blob) representing the generated image.

4. **Asset Creation in Contentful**  
   - Use the Contentful SDK to create an asset from the generated image.
5. **Security & Configuration**  
   - Store `TEXT_MODEL_TOKEN` and `IMAGE_MODEL_TOKEN` in environment variables in Contentful’s App Configuration.  
   - The front-end fetches them securely from the App parameters.

6. **Error Handling**  
   - If either API call fails or returns an invalid response, show an error message with possible next steps (“Try again,” “Revise prompt,” etc.).

---

## 7. UX / UI Considerations

1. **Layout**  
   - The main page includes:  
     - Prompt input field(s)  
     - Buttons for “Refine Prompt” and “Generate Image”  
     - A result section displaying the generated image

2. **Prompt Display**  
   - Show the **Original Prompt** and the **Optimized Prompt** side by side or in collapsible panels, so users understand how the text model changed their input.

3. **Regeneration Flow**  
   - Provide a clear way to return to the prompt editing step without losing the current text.  
   - Optionally store a history of changes or have a single fallback step.

4. **Visual Feedback**  
   - Distinguish between the steps: refining text vs. generating the image.  
   - Use loading spinners, progress bars, or placeholders.

5. **Accessibility**  
   - Ensure fields are labeled properly for screen readers, and dialogs (if used) follow best practices.

---

## 8. Metrics & Success Criteria

1. **Usage Frequency**  
   - How often do users visit the AI Generation page vs. manually uploading images?

2. **Prompt Refinement Adoption**  
   - Percentage of users who accept the text model’s optimized prompt vs. those who heavily edit it.

3. **Generation Success Rate**  
   - Ratio of successful image generations (no errors/timeouts) to total attempts.

4. **User Satisfaction**  
   - Informal feedback on whether the text-optimized prompts yield higher-quality images.

---

## 9. Risks & Mitigations

| **Risk**                                  | **Description**                                                                                        | **Mitigation**                                                                                                 |
|------------------------------------------|--------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------|
| **Text Model Over/Under Refinement**     | The model might not always produce a better prompt (risk of losing user trust).                        | Show both original and optimized prompts; let the user edit or revert.                                         |
| **Slow Inference Times**                  | Using large text or image models could lead to long wait times.                                        | Display clear loading indicators; consider smaller/faster models if speed is critical.                         |
| **API Rate Limits**                       | High usage might trigger Hugging Face rate-limit errors.                                               | Implement usage monitoring, possibly queue requests or degrade gracefully with a “Retry” message.             |
| **Token Leakage**                         | Exposing text/image model tokens in logs or client-side code.                                          | Store tokens in environment variables in the app config; ensure no direct user access.                         |
| **Image Size Limits**                     | Generated images may exceed Contentful’s asset size limit.                                             | Validate or compress the image before upload; handle errors gracefully.                                        |
| **Prompts with Sensitive Content**        | Users might enter prompts that produce questionable or restricted content.                              | Follow Hugging Face’s content guidelines; add disclaimers or filters if necessary.                            |
| **Maintenance & Upgrades**               | Changes to Contentful App Framework or Hugging Face APIs could break the integration.                  | Track dependencies, maintain version locks, and test updates on a staging environment.                        |

---

## 10. Implementation Phases

1. **Phase 1: Basic Page & Model Calls**  
   - Set up the Page location in Contentful.  
   - Hardcode a single text-to-image flow (no separate text model refinement).  
   - Verify image upload works in a test environment.

2. **Phase 2: Text Model Prompt Optimization**  
   - Integrate the text model call and display the refined prompt.  
   - Provide editing options for both original and refined prompts.  
   - Generate the final image from the chosen prompt.

3. **Phase 3: UI/UX Enhancements & Error Handling**  
   - Add loaders, spinners, clear error messages, and a polished design.  
   - Implement concurrency checks, handle or log rate-limit warnings.

4. **Phase 4: Production Hardening & Optional Features**  
   - Ensure environment variable tokens are securely managed.  
   - Possibly add a “prompt history” or “multi-image” generation option.  
   - Roll out to production and train users.

---

## 11. Open Questions

- **Branding or Style Guidelines**  
  - Should the text model prompt refinement align with brand-specific style guidelines?
- **Advanced Prompts**  
  - Do we enable advanced controls (aspect ratio, color style, artist styles, etc.)?
- **Multiple Image Variations**  
  - Do we want to generate multiple images at once for user selection, or keep it at one image to simplify the UI?
- **Localization**  
  - Do we need to handle multiple locales for the asset titles or do translations within the text model?

---

## 12. Conclusion

This **Page-based** Contentful App combines a text model refinement step with an image generation step to produce higher-quality AI images. By letting users view and modify both the original and optimized prompts, the tool offers a flexible yet guided approach to image creation. Once they’re satisfied with the output, uploading to Contentful as an asset is just one click away, ensuring a seamless editorial workflow. 