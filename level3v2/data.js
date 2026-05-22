/**
 * level3v2/data.js — Chitra Katha Level 3 v2 Tutorial Data
 * ==========================================================
 * Step-by-step guided drawing data for 5 traditional Indian art forms.
 *
 * Each entry in TUTORIAL_DATA contains:
 *   name         : display name
 *   artformKeys  : classifier keys that map to this tutorial
 *   totalSteps   : number of steps
 *   driveUrl     : Google Drive folder with reference step images
 *   steps[]      : array of { instruction: string }
 *                  Step images are loaded from:
 *                  level3v2/step_images/{id}/step_{n}.jpg  (1-indexed)
 *                  Evaluation master reference:
 *                  level3v2/step_images/{id}/reference.jpg
 */

// ── Tutorial step data ──────────────────────────────────────────────────────

const TUTORIAL_DATA = {

  // ── Kalighat Painting (23 steps) ──────────────────────────────────────────
  kalighat: {
    name: "Kalighat Painting",
    subtitle: "Woman with Fish — West Bengal",
    artformKeys: ["Kalighat of Bengal"],
    totalSteps: 23,
    driveUrl: "https://drive.google.com/drive/folders/13DsK4xGK9rZMM_sw5KkmSF2q0gvUMJj7",
    steps: [
      {
        instruction: "Start by drawing a large, soft oval in the upper center of your page to represent the face. Sketch the outer contour of the torso, using flowing, bold lines."
      },
      {
        instruction: "Extend two curved lines downward from the oval to outline the neck and the initial slope of the shoulders. Outline the basic shape of the lower body, ensuring the silhouette feels voluminous and rounded."
      },
      {
        instruction: "Define the arms by drawing two sets of parallel curved lines extending from the shoulders. End the limbs with curved lines making shape of her feet."
      },
      {
        instruction: "Sketch the basic outline of the hair, framing the top and sides of the oval face. Refine the facial features by marking the positions for the eyes, nose, and lips."
      },
      {
        instruction: "Draw curved lines over the torso making a saree. Draw the characteristic 'almond' or 'fish-shaped' eyes with long, expressive strokes. Detail the nose and the small, pursed lips to give the face a classic Kalighat expression. Add the fabric tucked behind her hair, add borders."
      },
      {
        instruction: "Draw the hands, focusing on the elegant, elongated finger shapes typical of traditional Indian art. Add volume to her hair and details to the fish she is holding."
      },
      {
        instruction: "Add the all the primary folds of the saree or clothing using sweeping, rhythmic lines across the torso."
      },
      {
        instruction: "Now we start with water colors. Begin adding the first layer of base color to the skin, typically using a light ochre or warm tone."
      },
      {
        instruction: "Add a second layer on the skin with a shade of orange to bring in depth, around corners to define the feature and shadows."
      },
      {
        instruction: "Apply the base color for the clothing, ensuring the paint is applied smoothly within the outlines. Make sure the brush follows the folds of the fabric."
      },
      {
        instruction: "Add a second layer on the saree with a darker shade to bring in depth, around corners to define the feature and shadows."
      },
      {
        instruction: "Define the borders of the saree (the paar), adding a second line parallel to the clothing edges. Add colour to the bindi, lips and alta on the palm and feet."
      },
      {
        instruction: "Paint details of the eyes, nose and lips including the pupils and the thick eyebrows in black."
      },
      {
        instruction: "Paint the eyelash and curly hair left loose around the ear."
      },
      {
        instruction: "Paint the hair with a deep black or dark indigo, keeping the edges crisp."
      },
      {
        instruction: "Finish the detailed linework by tracing the main outlines with a fine brush and black ink."
      },
      {
        instruction: "Add the black details on the saree to emphasize all the folds."
      },
      {
        instruction: "Use a slightly darker shade to add 'shading' or 'rolling' (darkening the edges) to give the figure volume."
      },
      {
        instruction: "After the paint dries. Add white lines to the ears and the initial circular shapes for the heavy traditional earrings."
      },
      {
        instruction: "Use white paint to draw the jewelry on the neck, like a necklace, following the curve of the collarbone."
      },
      {
        instruction: "Add bangles or 'shakha-pola' to the wrists using several small, parallel circular lines. Draw payal on her feet, and rings using white. Add intricate patterns to the saree border and jewelry using white or gold accents."
      },
      {
        instruction: "Add lines of orange to complete the fabric flowing behind her. Colour the fish in orange."
      },
      {
        instruction: "Add small intricate details to complete the fins and eyes of the fish. And here is your completed Kalighat painting."
      }
    ]
  },

  // ── Sohrai Painting (22 steps) ────────────────────────────────────────────
  sohrai: {
    name: "Sohrai Painting",
    subtitle: "Snake and Cow — Jharkhand",
    artformKeys: ["Soharai of Jharkhand"],
    totalSteps: 22,
    driveUrl: "https://drive.google.com/drive/folders/1p4yi3Lsh3hqf139BHelv5v00lzqNNC5V",
    steps: [
      {
        instruction: "Begin by preparing the base of your canvas. Apply a smooth, even layer of mud/ochre color base."
      },
      {
        instruction: "Now begin with using your fingers to spread the base material, ensuring the texture is organic and follows a consistent rhythm across the surface."
      },
      {
        instruction: "Once the base is slightly set, use a pencil to lightly sketch the large central silhouette of the animal (bull). Draw the broad head and the distinctive shape of the horns or ears using light pencil strokes."
      },
      {
        instruction: "Use the pencil to define the long, sweeping curve of the animal's back and the position of its tail. Make primary body divisions with the pencil. Add another pair of lines around the body creating a snake body."
      },
      {
        instruction: "Sketch the sturdy legs and hooves with the pencil to ensure the animal figure feels balanced on the base. Sketch the surrounding elements. Add concentric circles around the canvas for flowers, to fill the space around the main figure."
      },
      {
        instruction: "Begin applying the primary colors, like red oxide on the concentric circles in shapes of petals."
      },
      {
        instruction: "Then start painting red oxide in regular intervals on the body of the snake."
      },
      {
        instruction: "Use the same technique to fill in color for the other forest creature. Paint the tail, horn and head."
      },
      {
        instruction: "In a similar format continue to paint the body of the creature. The animal is slowly taking shape."
      },
      {
        instruction: "Now introduce light ochre to the canvas. Begin applying it into the sections of the snake's body."
      },
      {
        instruction: "Fill in the same color on the creature's body. Apply color to the secondary figures, ensuring they complement the palette of the central animal."
      },
      {
        instruction: "Use the contrasting shade to complete the floral motifs and background plants. Define the leaves and flower."
      },
      {
        instruction: "Add more depth to the animal's body by layering a second coat of color in specific patches or sections."
      },
      {
        instruction: "Start the final outlining phase by using black ink or soot to trace the top of the animal's head and horns along with the snake's head. Draw the bold black outline around the eyes and snout to bring out the animal's expression."
      },
      {
        instruction: "Begin by drawing the outline around the snake and then fill in the sections with black, to complete and define its body."
      },
      {
        instruction: "Trace the entire silhouette of the animal with a thick, confident black line to make it pop against the base. Use the black outline to define the legs, hooves, and the rhythmic curve of the tail."
      },
      {
        instruction: "Use black lines to add patterns inside the colored sections of the animal's body."
      },
      {
        instruction: "Add black outlines to the flora in the background."
      },
      {
        instruction: "Now complete the leaves by adding black outlines."
      },
      {
        instruction: "Complete the painting by tracing the branches and stem."
      },
      {
        instruction: "Once the black outline dries. Use white paint detailing on the black outline of the snake to make it pop against the base."
      },
      {
        instruction: "Add these white details in and around the flora and leaves."
      }
    ]
  },

  // ── Warli Painting (22 steps) ─────────────────────────────────────────────
  warli: {
    name: "Warli Painting",
    subtitle: "Celebration Scene — Maharashtra",
    artformKeys: ["Warli oh Maharashtra"],
    totalSteps: 22,
    driveUrl: "https://drive.google.com/drive/folders/1AR3velnT9dPbZ5gOTn6osiMDDPUtCgK8",
    steps: [
      {
        instruction: "Begin by preparing the base of your canvas or wall by applying a smooth, even layer of red ochre (geru) to create the traditional background."
      },
      {
        instruction: "Once the base dries slightly, lightly sketch a large central square (chauk) using a pencil to establish the main focal area of the composition."
      },
      {
        instruction: "Lightly draw a large circle with your pencil to outline the boundary for a 'Tarpa' dance or a communal gathering scene."
      },
      {
        instruction: "Now that the base is ready, take a thin paintbrush and begin with tracing along the outline of the square."
      },
      {
        instruction: "Now use a round brush and start painting blobs around the circumference of the circle. These represent the head."
      },
      {
        instruction: "Start sketching the basic geometric shapes for the human figures: draw a triangle that forms the torso."
      },
      {
        instruction: "Next draw another triangle that meets at the tip of the previous triangle/torso."
      },
      {
        instruction: "Add two slightly bent lines at the bottom of the triangles to represent the legs in a moving or dancing posture."
      },
      {
        instruction: "Sketch simple lines for the arms, showing them connected to the figures on either side to signify a dance."
      },
      {
        instruction: "Begin the painting phase by using a fine brush to fill in the triangles representing the body of the human figures."
      },
      {
        instruction: "Now repeat the same process of drawing triangles across the circle to form a human chain."
      },
      {
        instruction: "Paint the white base for the triangular bodies of all the dancing figures. Paint the arms ensuring the lines remain thin, rhythmic and connected."
      },
      {
        instruction: "Draw a series of small, rhythmic dashes along the ground line to represent the legs and show the movement of the dancers."
      },
      {
        instruction: "Carefully fill in the triangles with white color."
      },
      {
        instruction: "Draw the central figure of the 'Tarpa' player's body. He is the central point of your composition, which will act as the anchor."
      },
      {
        instruction: "Next paint the curved shape of the traditional Horn instrument using thin white lines."
      },
      {
        instruction: "Add the arms and legs and other small details to the instrument. It should appear that he is blowing air into the horn."
      },
      {
        instruction: "Start the detailing phase by adding tiny strokes on the human figures. Draw white lines to the central Tarpa instrument, highlighting its unique curved shape."
      },
      {
        instruction: "Next we move to the border. Drop two blobs of white paint on either side of the border and extend them a little using a thin brush to create a leaf shape."
      },
      {
        instruction: "Repeat this technique to paint the entire side of the border."
      },
      {
        instruction: "Complete the painting by adding the same pattern around the entire border to frame the composition."
      },
      {
        instruction: "To finish off, just erase any pencil marks."
      }
    ]
  },

  // ── Gond Painting (18 steps) ──────────────────────────────────────────────
  gond: {
    name: "Gond Painting",
    subtitle: "Deer in the Forest — Madhya Pradesh",
    artformKeys: ["Gond Art of Madhya Pradesh"],
    totalSteps: 18,
    driveUrl: "https://drive.google.com/drive/folders/1iHsnair9wHsxxeaKO4THyUBDjnyGceEk",
    steps: [
      {
        instruction: "Draw two ovals and extend a curved line from each of their ends using a pencil. This represents the head and neck of the deer."
      },
      {
        instruction: "Next add few lines to draw the base of the body of the deers."
      },
      {
        instruction: "Sketch the legs using long, slightly curved vertical lines, ensuring they feel slender and balanced."
      },
      {
        instruction: "Now begin drawing the main tree trunk behind the deer using a thick upward curved line. Extend branches outward in multiple directions using flowing, organic lines."
      },
      {
        instruction: "Now lighten this pencil drawing as we begin to sketch the details using a black pen. Draw the head using a small oval, and extend a pointed snout."
      },
      {
        instruction: "Add two leaf-shaped ears on top of the head."
      },
      {
        instruction: "Next draw the eyes and extend the necks."
      },
      {
        instruction: "Draw the second deer beside the first, overlapping slightly to create interaction."
      },
      {
        instruction: "Repeat the same structure: body curve, neck, head, and legs. Keep proportions similar."
      },
      {
        instruction: "Refine both deer shapes, smoothing curves and ensuring the bodies feel full and flowing."
      },
      {
        instruction: "Finish drawing the legs of both the deers."
      },
      {
        instruction: "Add lines to complete the back of the second deer."
      },
      {
        instruction: "Now begin drawing the main tree trunk behind the deer using a thick upward curved line."
      },
      {
        instruction: "Extend branches outward in multiple directions using flowing, organic lines."
      },
      {
        instruction: "Add smaller sub-branches splitting from the main branches, creating a dense structure."
      },
      {
        instruction: "Add lines and connect these sub-branches together to the main branch."
      },
      {
        instruction: "Start drawing leaves using teardrop or oval shapes attached along the branches. Fill the entire tree canopy with clustered leaves, ensuring a rich and full appearance. Once done fill the body of the deer in yellow solid paint."
      },
      {
        instruction: "Next add shades of ochre and orange to the remaining body of the deer."
      }
    ]
  },

  // ── Kalamkari Painting (15 steps) ────────────────────────────────────────
  kalamkari: {
    name: "Kalamkari Painting",
    subtitle: "Peacock — Tamil Nadu",
    artformKeys: ["Kalamkari Of Tamil Nadu"],
    totalSteps: 15,
    driveUrl: "https://drive.google.com/drive/folders/1SJ6WykvZ36_ZZdZ65k-Fme4pMWjWFqk4",
    steps: [
      {
        instruction: "Start sketching the main body of the peacock using a curved oval shape placed slightly to one side of the page. Make 2 paisley motifs to represent its body, neck and head."
      },
      {
        instruction: "Then add curved lines which roughly denote the placement of wings and feathers."
      },
      {
        instruction: "Double outline these wings in order to mark space for the feathers, tails and feet."
      },
      {
        instruction: "Draw eye, head piece and add other chunky details around the neck and wings."
      },
      {
        instruction: "Lighten the pencil marks and begin with outlining the peacock motif with a black pen/brush pen. We begin from one side of the motif and continue it to the other end. Begin with the beak and the details on the head (eye, neck and feather)."
      },
      {
        instruction: "Next we will detail out the body with some floral pattern creating shapes in which we can fill solid color later."
      },
      {
        instruction: "Then we move on to the feet, add details of the claw and feathers."
      },
      {
        instruction: "Next draw the central wing of the peacock. It needs to be detailed and illustrative."
      },
      {
        instruction: "Then add lines and finish the other wing. Keep the lines neat and clean."
      },
      {
        instruction: "Next complete the tail adding illustrative detailed features arranged in rhythmic pattern."
      },
      {
        instruction: "We have almost completed the outline. Finish it with adding extra paisley shaped feathers below the tail."
      },
      {
        instruction: "Now we start with filling colors, fill in red in the central regions of the neck, wings and tail."
      },
      {
        instruction: "Then fill green in the head and outlines of the wings and tail."
      },
      {
        instruction: "Use the blue to complete most of the peacock motif, colour all the feathers in blue."
      },
      {
        instruction: "Next finish the artwork by painting the background in yellow."
      }
    ]
  },

  // ── Madhubani Painting (18 steps) ────────────────────────────────────────
  madhubani: {
    name: "Madhubani Painting",
    subtitle: "Fish — Bihar",
    artformKeys: ["Madhubani of Bihar"],
    totalSteps: 18,
    driveUrl: "https://drive.google.com/drive/folders/1hNm_vYjzfBKa32OSADbpl4iDAKBxhdI_",
    steps: [
      {
        instruction: "Lightly draw a circular border close to the edges of the page to define the composition area. Draw few concentric circles parallel to the first border to create the characteristic double-line frame of Madhubani art."
      },
      {
        instruction: "Start sketching the central figure or main motif using light and rhythmic curved lines."
      },
      {
        instruction: "Add more details to the central figure. We are drawing two fishes enclosed in a circle."
      },
      {
        instruction: "Sketch curved lines representing the fins and heads of the fish."
      },
      {
        instruction: "Complete the fishes by adding eyes and details to the body."
      },
      {
        instruction: "Now we move to the next circle. We need to fill it with small wedges to make a pattern and fill it with lines later."
      },
      {
        instruction: "Next we move towards adding details to the outer circle. Begin by drawing oval leaf shapes facing each other to complete the entire border."
      },
      {
        instruction: "Now draw the line/circle defining the border."
      },
      {
        instruction: "Add another line of triangles in the middle circle. The base of the Madhubani painting is ready with this pencil sketch."
      },
      {
        instruction: "Now refine all outlines using a black pen or fine brush, going over the pencil sketch with confident, continuous lines. We will begin with the central motif."
      },
      {
        instruction: "Now go creative and start filling it with patterns! Add the characteristic double-line detailing within the figures."
      },
      {
        instruction: "Complete the fishes by adding scales and finish them by filling shapes with lines."
      },
      {
        instruction: "Now in a similar style of detailing, outline the triangles and fill them with lines to make a beautiful pattern."
      },
      {
        instruction: "We will similarly outline the outer border and fill in the line details using black pen or fine brush."
      },
      {
        instruction: "Now we start filling the colours within these shapes. We need to use bright and contrasting colors. Use yellow for the face and orange in the borders."
      },
      {
        instruction: "Next add a pop of red in the border and tail of the fish."
      },
      {
        instruction: "Then paint in green in background of the fishes and other borders."
      },
      {
        instruction: "Complete the painting by adding blue in the remaining areas."
      }
    ]
  },

  // ── Phad Painting (22 steps) ──────────────────────────────────────────────
  phad: {
    name: "Phad Painting",
    subtitle: "Elephant and Warrior — Rajasthan",
    artformKeys: ["Phad of Rajasthan"],
    totalSteps: 22,
    driveUrl: "https://drive.google.com/drive/folders/1G62IFretMTA076HpgkrWtrIktnqvGC82",
    steps: [
      {
        instruction: "Lightly sketch the basic outline of the elephant using simple curved lines to define the body mass."
      },
      {
        instruction: "Begin drawing the rider seated on top by sketching a small torso and head above the saddle."
      },
      {
        instruction: "Extend the trunk downward with a gentle curve and add the curled tip at the end. Draw the legs using thick, slightly tapered forms, positioning them to suggest a walking posture. Add the ear and tail."
      },
      {
        instruction: "Define the rider's posture, draw one arm extended forward and the other bent inward."
      },
      {
        instruction: "Now sketch the decorative saddle cloth over the elephant's back using a rectangular shape with soft edges. Also add details of this drape and poshak (clothes) to the rider."
      },
      {
        instruction: "Add clothing details such as sleeves, waistband, and draped fabric using flowing lines. Begin decorating the elephant by adding ornamental patterns on the headgear, neck, and saddle."
      },
      {
        instruction: "Now that the base drawing is ready we begin with color. Start coloring by applying a flat yellow base to the decorative cloth and skin of the rider."
      },
      {
        instruction: "Add orange to jewellery around the elephant's neck, toes and the rider's headgear."
      },
      {
        instruction: "Next use green to build in contrast and paint the fabrics of the rider and the elephant's saddle."
      },
      {
        instruction: "Use red to paint the drape and headgear of the rider."
      },
      {
        instruction: "Next use the red to highlight facial features, trunk and eyes of the elephant. Also use it to add contrast to the decorative saddle."
      },
      {
        instruction: "Next we start with the outlining using black pen/brush pen. Enhance details by outlining facial features, ornaments, and patterns with black for clarity."
      },
      {
        instruction: "Similarly outline the fabric details on the torso and the folds of the fabric using black."
      },
      {
        instruction: "Next we move on to the lower torso. Complete it with black outlines."
      },
      {
        instruction: "Draw bold outline around the elephant's face to highlight the jewellery and his eyes. Fold of his trunk and ears."
      },
      {
        instruction: "Then draw the neck piece and the front leg and a rope which is held by the rider."
      },
      {
        instruction: "Complete the next two legs similarly. The key here is to keep the lines clean."
      },
      {
        instruction: "Finish the last leg and tail of the elephant similarly, adding and outlining all the details."
      },
      {
        instruction: "Next we add decorative details to the saddle. Complete it with neat and clean borders."
      },
      {
        instruction: "Now paint the elephant black. Be careful around the eyes."
      },
      {
        instruction: "Once the black paint dries add small details around his face and fabric using white dots."
      },
      {
        instruction: "Next paint a red border around the drawing to complete the painting."
      }
    ]
  },

  // ── Pitchwai Painting (20 steps) ──────────────────────────────────────────
  pitchwai: {
    name: "Pitchwai Painting",
    subtitle: "Lotus and Cow — Nathdwara, Rajasthan",
    artformKeys: ["Pichhwai of Rajasthan"],
    totalSteps: 20,
    driveUrl: "https://drive.google.com/drive/folders/1yR4qjllFfJvAL9fUK8tRW5q6jXiD8kct",
    steps: [
      {
        instruction: "Start by lightly sketching the main subject, a cow. Place it slightly off-center to allow space for background elements. Draw the basic body of the cow using a large horizontal oval, ensuring the form feels full and balanced."
      },
      {
        instruction: "Next we need to add lotus buds and stems in the background to make the composition look beautiful and balanced."
      },
      {
        instruction: "After finishing the lotus, define the snout and forehead of the cow with gentle curves. Start adding jewellery around the horns and neck."
      },
      {
        instruction: "Lightly mark the placement of the eyes, nose, and mouth, keeping the expression calm and gentle. Refine the ears and horns using soft curved lines, keeping them symmetrical and elegant."
      },
      {
        instruction: "Lightly draw a rectangular border near the edges of the page to frame the composition. Next fill it with a bright yellow color — this is our base."
      },
      {
        instruction: "Now we begin painting white base on one of the petals of the lotus."
      },
      {
        instruction: "Next we are going to begin with shading. Add a slight shade of pink on the top which smoothens out into the white."
      },
      {
        instruction: "Similarly take some yellow and paint it on the lower end of the petal and blur it into the white."
      },
      {
        instruction: "Follow the same steps to paint all the lotus petals and the buds."
      },
      {
        instruction: "Next add in the pink and yellow shading to bring in the depth."
      },
      {
        instruction: "Once done, to define these flowers we will take a deeper shade of pink and outline all the flowers and buds."
      },
      {
        instruction: "Next we start filling the stems and leaves with a slightly darker shade of green."
      },
      {
        instruction: "Next we take a lighter green and finish the leaves and add a small line of detail over the darker green."
      },
      {
        instruction: "Use the darker green to create blobs over the leaf and create depth."
      },
      {
        instruction: "Next paint a section of horns in bright red and the hump of the cow in orange."
      },
      {
        instruction: "Then use gold paint to fill in all the jewellery around the horns and the neck."
      },
      {
        instruction: "Once the gold paint dries take some brown paint on a thin brush and outline all the jewellery and fill it with simple but intricate patterns."
      },
      {
        instruction: "Next using a black paint draw delicate eyes and nose."
      },
      {
        instruction: "Take a flat brush, and paint around the border of the cow to highlight all the curves and turns of the body."
      },
      {
        instruction: "To complete the painting outline the cow using a thin brush. The brown outline will make the central figure pop against the background."
      }
    ]
  },

  // ── Talapatra Chitra (13 steps) ───────────────────────────────────────────
  talapatra: {
    name: "Talapatra Chitra",
    subtitle: "Fish Motif — Odisha",
    artformKeys: ["Talpatra Chittar of Odisha"],
    totalSteps: 13,
    driveUrl: "https://drive.google.com/drive/folders/1hgr4bjwhLErHJUx2XZnDoKg8n4nDpI6V",
    steps: [
      {
        instruction: "Begin by preparing your foam sheet, ensuring the surface is clean and placed on a flat, steady area."
      },
      {
        instruction: "Use a pencil to lightly mark the exact centre of the foam to prepare for the circular composition."
      },
      {
        instruction: "Lightly draw a large circle in the middle of the foam where the fish motif will be placed."
      },
      {
        instruction: "Sketch a decorative rectangular border around the edges of the foam sheet using a ruler."
      },
      {
        instruction: "Inside the central circle, sketch the basic almond-shaped silhouette of the fish."
      },
      {
        instruction: "Draw the curved lines for the tail and fins, ensuring they touch the edges of the circle for a balanced look."
      },
      {
        instruction: "Use a sharp tool (like a stylus or a blunt needle) to firmly trace over the circular outline, creating a deep dent in the foam."
      },
      {
        instruction: "Engrave the outer border lines with the sharp tool, applying consistent pressure to create clear grooves."
      },
      {
        instruction: "Etch the main body and fins of the fish, following your pencil sketch to create the permanent recessed design."
      },
      {
        instruction: "Add fine engraved details like scales on the fish's body and geometric patterns within the border."
      },
      {
        instruction: "Apply a layer of black paint over the entire foam surface, making sure the paint settles into all the engraved dents and grooves."
      },
      {
        instruction: "Quickly and gently rub off the excess wet paint from the surface using a soft cloth or sponge."
      },
      {
        instruction: "Once the surface is wiped clean, the black paint remaining in the dents will reveal your finished etched design."
      }
    ]
  }

};

// ── Classifier key → Tutorial ID mapping ────────────────────────────────────
// Keys must match EXACTLY what the Teachable Machine classifier returns
const ARTFORM_TO_TUTORIAL = {
  "Kalighat of Bengal":         "kalighat",
  "Soharai of Jharkhand":       "sohrai",
  "Warli oh Maharashtra":       "warli",
  "Gond Art of Madhya Pradesh": "gond",
  "Talpatra Chittar of Odisha": "talapatra",
  "Kalamkari Of Tamil Nadu":    "kalamkari",
  "Madhubani of Bihar":         "madhubani",
  "Phad of Rajasthan":          "phad",
  "Pichhwai of Rajasthan":      "pitchwai"
};
