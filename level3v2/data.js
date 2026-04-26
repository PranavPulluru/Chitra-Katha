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
        instruction: "Define the arms by drawing two sets of parallel curved lines extending from the shoulders. End the limbs with curved lines making the shape of her feet."
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
        instruction: "Add all the primary folds of the saree or clothing using sweeping, rhythmic lines across the torso."
      },
      {
        instruction: "Now we start with water colours. Begin adding the first layer of base colour to the skin, typically using a light ochre or warm tone."
      },
      {
        instruction: "Add a second layer on the skin with a shade of orange to bring in depth, around corners to define the features and shadows."
      },
      {
        instruction: "Apply the base colour for the clothing, ensuring the paint is applied smoothly within the outlines. Make sure the brush follows the folds of the fabric."
      },
      {
        instruction: "Add a second layer on the saree with a darker shade to bring in depth, around corners to define the features and shadows."
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
        instruction: "Add the black details on the saree to emphasise all the folds."
      },
      {
        instruction: "Use a slightly darker shade to add 'shading' or 'rolling' (darkening the edges) to give the figure volume."
      },
      {
        instruction: "After the paint dries. Add white lines to the ears and the initial circular shapes for the heavy traditional earrings."
      },
      {
        instruction: "Use white paint to draw the jewellery on the neck, like a necklace, following the curve of the collarbone."
      },
      {
        instruction: "Add bangles or 'shakha-pola' to the wrists using several small, parallel circular lines. Draw payal on her feet, and rings using white. Add intricate patterns to the saree border and jewellery using white or gold accents."
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
        instruction: "Begin by preparing the base of your canvas. Apply a smooth, even layer of mud/ochre colour base."
      },
      {
        instruction: "Now begin using your fingers to spread the base material, ensuring the texture is organic and follows a consistent rhythm across the surface."
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
        instruction: "Begin applying the primary colours, like red oxide on the concentric circles in shapes of petals."
      },
      {
        instruction: "Continue adding colour to the background floral and plant motifs, layering warm earth tones to build up the surrounding composition."
      },
      {
        instruction: "Fill in the remaining background sections with earthy tones, completing the first colour pass across the entire canvas."
      },
      {
        instruction: "Use your pencil to mark out geometric patterns or secondary forest creatures like birds and lizards."
      },
      {
        instruction: "Begin applying the primary colours, like red oxide or yellow ochre, into the sections you sketched for the animal's body."
      },
      {
        instruction: "Fill in the floral motifs and background plants with warm, earthy tones."
      },
      {
        instruction: "Apply colour to the secondary figures, ensuring they complement the palette of the central animal."
      },
      {
        instruction: "Use a contrasting earthy shade to fill in the geometric border patterns you sketched earlier."
      },
      {
        instruction: "Add more depth to the animal's body by layering a second coat of colour in specific patches or sections."
      },
      {
        instruction: "Paint the details of the 'Tree of Life,' using natural pigments to define the leaves and branches."
      },
      {
        instruction: "Start the final outlining phase by using black ink or soot to trace the top of the animal's head and horns."
      },
      {
        instruction: "Draw the bold black outline around the eyes and snout to bring out the animal's expression."
      },
      {
        instruction: "Trace the entire silhouette of the animal with a thick, confident black line to make it pop against the base."
      },
      {
        instruction: "Use the black outline to define the legs, hooves, and the rhythmic curve of the tail."
      },
      {
        instruction: "Add fine black outlines to the birds, lizards, and floral creepers in the background."
      },
      {
        instruction: "Use thin black lines to add texture and patterns inside the coloured sections of the animal's body."
      },
      {
        instruction: "Complete the painting by tracing the outer border of the entire composition with a final, heavy black outline."
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
        instruction: "Use a pencil to lightly sketch the central point of your composition, which will act as the anchor for the rhythmic circular movement."
      },
      {
        instruction: "Lightly draw a large circle with your pencil to outline the boundary for a 'Tarpa' dance or a communal gathering scene."
      },
      {
        instruction: "Start sketching the basic geometric shapes for the human figures: draw two triangles that meet at the tip to form the torso."
      },
      {
        instruction: "Use the pencil to add a small circle on top of the triangles to represent the head."
      },
      {
        instruction: "Sketch simple lines for the arms, showing them connected to the figures on either side to signify a dance."
      },
      {
        instruction: "Add two slightly bent lines at the bottom of the triangles to represent the legs in a moving or dancing posture."
      },
      {
        instruction: "Draw the central figure of the 'Tarpa' player, sketching the long, curved shape of the traditional wind instrument."
      },
      {
        instruction: "Sketch surrounding elements of nature, such as a stylised sun or a simple 'Tree of Life' using basic lines and triangles."
      },
      {
        instruction: "Add details of daily life around the central dance, such as simple huts made of square and triangular shapes."
      },
      {
        instruction: "Draw small domestic animals like goats or birds using the same minimalist geometric style."
      },
      {
        instruction: "Begin the painting phase by using a fine brush and white pigment (rice paste) to fill in the heads of the human figures."
      },
      {
        instruction: "Paint the white base for the triangular bodies of all the dancing figures."
      },
      {
        instruction: "Carefully fill in the white colour for the arms and legs, ensuring the lines remain thin and rhythmic."
      },
      {
        instruction: "Apply the white pigment to the central Tarpa instrument, highlighting its unique curved shape."
      },
      {
        instruction: "Paint the surrounding nature motifs — the sun and trees — using solid white strokes."
      },
      {
        instruction: "Fill in the geometric shapes of the huts and animals with a consistent layer of white."
      },
      {
        instruction: "Start the detailing phase by adding tiny strokes for hair or traditional headgear on the human figures."
      },
      {
        instruction: "Add delicate white dots or short 'v' shapes along the tree branches to represent leaves or flowers."
      },
      {
        instruction: "Use a very fine brush to add texture to the clothing of the figures or the thatched roofs of the huts."
      },
      {
        instruction: "Draw a series of small, rhythmic dashes along the ground line to represent the movement of the dancers."
      },
      {
        instruction: "Complete the painting by adding a simple geometric border around the entire scene to frame the composition."
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
        instruction: "Begin by applying a flat, smooth base coat of colour to your canvas, usually a bright or earthy tone that will make the patterns pop."
      },
      {
        instruction: "Use a pencil to lightly sketch the large, flowing silhouette of your central figure, such as a deer, bird, or a mythical creature."
      },
      {
        instruction: "Define the long, curved neck and the primary body shape with sweeping pencil lines."
      },
      {
        instruction: "Sketch the delicate legs and antlers or horns, ensuring the figure feels balanced and graceful."
      },
      {
        instruction: "Add the placement for the eye and any large internal divisions on the body where different patterns will go."
      },
      {
        instruction: "Sketch the surrounding nature elements, like a stylised tree with swirling branches or floating leaves."
      },
      {
        instruction: "Use your pencil to add secondary forest animals or birds to create a sense of a living ecosystem."
      },
      {
        instruction: "Fill in the main body of your central figure with a solid, vibrant base colour using a medium brush."
      },
      {
        instruction: "Apply contrasting solid colours to the different sections of the background elements, like leaves and tree trunks."
      },
      {
        instruction: "Paint the secondary animals in different hues to ensure each character in the story stands out."
      },
      {
        instruction: "Start the detailing phase by choosing your 'signature' Gond pattern, such as dots, dashes, or tiny scales."
      },
      {
        instruction: "Using a fine brush, begin filling the first section of the central animal with a repetitive pattern of small, uniform dots."
      },
      {
        instruction: "In the next section, switch to a 'comb' pattern — groups of short, parallel lines that follow the curve of the body."
      },
      {
        instruction: "Add a 'seed' or 'grain' motif to the neck or legs to create a different texture within the same figure."
      },
      {
        instruction: "Use a bright, contrasting colour to add 'fish-scale' patterns to the tail or fins of your creature."
      },
      {
        instruction: "Apply rhythmic dash patterns to the branches of the tree, making them look as if they are vibrating with energy."
      },
      {
        instruction: "Detail the leaves of the tree with tiny, intricate veins or interlocking circles."
      },
      {
        instruction: "Paint the eye of the central figure with a bold black centre surrounded by a bright white or yellow ring."
      }
    ]
  },

  // ── Kalamkari Painting (15 steps) ────────────────────────────────────────
  kalamkari: {
    name: "Kalamkari Painting",
    subtitle: "Pen on Fabric — Andhra Pradesh",
    artformKeys: ["Kalamkari Of Tamil Nadu"],
    totalSteps: 15,
    driveUrl: "",
    steps: [
      {
        instruction: "Prepare your canvas by washing the cotton cloth with a solution of myrobalan powder and water to mordant the surface. This ensures the natural dyes will bond permanently to the fabric."
      },
      {
        instruction: "Once dry, use a fine brush dipped in black outline ink to sketch the large central deity figure — a standing figure of Rama, Krishna, or a goddess. Draw just the outer silhouette and head position."
      },
      {
        instruction: "Define the face with almond-shaped eyes, a long curved nose, and full lips. Add the headdress or crown — a tall kirita or peacock-feathered mukuta that identifies the deity."
      },
      {
        instruction: "Sketch the flowing torso, drawing the arms in their characteristic mudra positions — one raised in blessing, one holding an attribute such as a lotus, conch, or bow."
      },
      {
        instruction: "Add the lower garments — a dhoti or pattu pavadai — with sweeping curved lines that suggest the weight and flow of silk. Kalamkari garments fall generously from the waist downward."
      },
      {
        instruction: "Draw the decorative jewellery — layered necklaces, heavy earrings, armlets, and anklets — using small repeated geometric motifs. These ornamental details are a Kalamkari hallmark."
      },
      {
        instruction: "Frame the central figure with a large arch or temple canopy formed of layered lotus petals and scrolling foliage. This creates the sacred space around the deity."
      },
      {
        instruction: "Add companion figures — attendants, musicians, or smaller deities — flanking the central figure in the lower registers of the composition."
      },
      {
        instruction: "Fill the background with scrolling floral creepers, lotus ponds, and narrative vignettes. Every inch of the border area should be richly patterned with plant and animal motifs."
      },
      {
        instruction: "Begin applying colour with natural dyes, starting with warm tones. Fill skin areas with a golden-ochre wash and clothing areas with a soft first pass of their base colour."
      },
      {
        instruction: "Apply deep red (pomegranate rind dye) to the main garments and the border archway. Let this layer dry fully before continuing to the next colour."
      },
      {
        instruction: "Fill the foliage and creepers with indigo or natural green. Apply yellow (turmeric) to jewellery and gold accents. Keep colour washes transparent and even — Kalamkari colour is never opaque."
      },
      {
        instruction: "Add a second, deeper layer of each colour to the shadow areas — beneath the arms, in the folds of fabric, and around the face — to give the figure warmth and volume."
      },
      {
        instruction: "Use the fine kalam pen to reinforce all outlines in strong black, clarifying every contour, jewellery edge, and facial feature. Add fine interior line details to garment patterns."
      },
      {
        instruction: "Complete the painting by drawing a framing border of repeating lotus buds and creeper scrolls around the entire composition. This final border ties the picture together and echoes Kalamkari's temple-art origins."
      }
    ]
  },

  // ── Madhubani Painting (18 steps) ────────────────────────────────────────
  madhubani: {
    name: "Madhubani Painting",
    subtitle: "Radha Krishna — Bihar",
    artformKeys: ["Madhubani of Bihar"],
    totalSteps: 18,
    driveUrl: "",
    steps: [
      {
        instruction: "Prepare a sheet of handmade paper by applying a thin wash of white to create a smooth, even base. Let it dry fully before beginning."
      },
      {
        instruction: "Draw a double-line rectangular border close to the edges of the paper — two parallel black lines about 5mm apart. This outer frame is the first mark in every Madhubani composition."
      },
      {
        instruction: "Inside the border, draw a second smaller rectangle, then fill the band between the two borders with repeating geometric motifs — small diamonds, zigzags, or short parallel dashes."
      },
      {
        instruction: "Lightly sketch the central figure in pencil — typically Krishna with his flute or Radha. Position the figure centrally with the head at upper-centre of the composition."
      },
      {
        instruction: "Draw the large, characteristic wide eyes — the irises are filled solidly and pupils clearly marked. Add the long, sweeping eyebrows that nearly meet at the bridge of the nose."
      },
      {
        instruction: "Define the face outline: a broad forehead, a straight nose, and full lips. Add the elaborate tilaka mark on the forehead. The face in Madhubani is frontal and perfectly symmetrical."
      },
      {
        instruction: "Sketch the torso in a slightly three-quarter pose, with arms positioned holding a flute or garland. Draw elaborate necklaces, earrings, and bangles using simple ring-and-dot shorthand."
      },
      {
        instruction: "Add the lower half of the figure — the dhoti or ghagra falling in gentle curves. Extend lotus flowers or peacock feathers into the space around the feet."
      },
      {
        instruction: "Draw a large lotus plant or kadamba tree beside the figure to fill the vertical space. Lotus pads, buds, and blooms are the single most common space-filler in Madhubani."
      },
      {
        instruction: "Scatter fish motifs in pairs throughout the background — fish (machha) are the most auspicious symbol in Mithila art. Add birds, parrots, and stylised suns in the remaining gaps."
      },
      {
        instruction: "Begin applying colour with flat brushes, starting with the figure's skin in a warm golden tone. Fill solidly inside the outlines, keeping colours flat and even."
      },
      {
        instruction: "Paint the main garment in red or deep pink. Apply blue to the background sky areas, and green to the lotus leaves. Madhubani colour fields are bold and unshaded."
      },
      {
        instruction: "Fill secondary motifs — fish in silver-white, lotus blooms in pink and yellow, birds in bright contrasting colours. Keep every colour field flat and decisive."
      },
      {
        instruction: "Apply a background colour to fill any remaining white paper — often yellow-ochre or pale terracotta — so the surface is completely covered, following the horror vacui principle of Madhubani."
      },
      {
        instruction: "Now reinforce all outlines using a fine brush dipped in strong black ink. Trace every contour with a double-line stroke — the characteristic twin outline of Madhubani."
      },
      {
        instruction: "Add fine pattern details inside each colour field — parallel lines on garments, dot clusters on lotus petals, scale patterns on fish bodies. The density of interior mark-making gives Madhubani its richness."
      },
      {
        instruction: "Paint the border band with a repeating pattern in a contrasting colour — rows of dots, triangles, or stylised mango (kalka) forms. The border should feel as intricate as the central image."
      },
      {
        instruction: "Make final adjustments — strengthen any outlines that need sharpening, fill any remaining white gaps, and confirm that every inch of the surface carries pattern or colour. Your Madhubani painting is complete."
      }
    ]
  },

  // ── Phad Painting (20 steps) ──────────────────────────────────────────────
  phad: {
    name: "Phad Painting",
    subtitle: "Epic Scroll — Rajasthan",
    artformKeys: ["Phad of Rajasthan"],
    totalSteps: 20,
    driveUrl: "",
    steps: [
      {
        instruction: "Prepare a long horizontal canvas by stretching natural cotton cloth on a frame. Coat it with a paste of chalk or starch to create a smooth, receptive painting ground."
      },
      {
        instruction: "Sketch the overall layout in pencil. Phad is a narrative scroll — divide the horizontal space into multiple registers (horizontal bands), each containing a scene from the folk hero's story."
      },
      {
        instruction: "In the central register, draw the large hero figure — Pabuji or Devnarayan — on horseback. The hero is always the largest figure in the composition, shown in bold profile."
      },
      {
        instruction: "Draw the hero's horse with a curved neck, arched tail, and four hooves clearly shown. Decorate the horse with a patterned saddle and ornamental headgear."
      },
      {
        instruction: "Add a canopy (chatri) above the hero's head to signify royal or divine status. Draw banner-carrying attendants flanking the mounted hero on either side."
      },
      {
        instruction: "Sketch the upper register: draw a row of female figures — the hero's wives or attendant goddesses — standing in graceful profile. Their saris flow behind them in long, sweeping curves."
      },
      {
        instruction: "In the lower register, sketch the dramatic action scenes — a battle with enemies, a cattle rescue episode, or a demon-slaying sequence. Use dynamic diagonal poses for the fighting figures."
      },
      {
        instruction: "Add the animals of the narrative: camels, cows, peacocks, and snakes winding through the background space. All animals are depicted in clear side profile."
      },
      {
        instruction: "Draw the architectural elements — a palace with arched doorways, a temple with a shikhara spire, or a village well with women gathering. These ground the narrative in a recognisable landscape."
      },
      {
        instruction: "Sketch the trees and vegetation — stylised trees with round canopies and straight trunks, always with birds perched in the branches. Tree tops divide the sky area from the narrative below."
      },
      {
        instruction: "Begin applying colour. Fill the background sky area with a flat deep red — red oxide or bright vermilion is the dominant background colour of Phad painting."
      },
      {
        instruction: "Apply yellow ochre to the architectural forms (palace walls, temple towers) and fill the ground plane with a warm tan tone."
      },
      {
        instruction: "Paint the hero's costume and horse decoration in bright green and yellow. Apply bold geometric patterns to garments — Phad figures wear ornately decorated dhotis and angarkhas."
      },
      {
        instruction: "Colour the female figures in pink, orange, and saffron. Use flat, unshaded colour fills — Phad colour is opaque and decisive, never graduated or blended."
      },
      {
        instruction: "Fill the battle scenes with contrasting hues — blue for enemy figures, green for the hero's allies — to help the viewer follow the narrative across the scroll."
      },
      {
        instruction: "Paint the animals with characteristic Phad body decoration — painted spots, saddlecloths, and ornamental trappings on every animal, making each one visually distinct."
      },
      {
        instruction: "Begin the detailed black outline pass. Using a fine brush loaded with carbon black, trace every contour of every figure, from the topmost register to the bottom."
      },
      {
        instruction: "Add fine interior detailing lines — the feathers of peacocks, the scales of snakes, the woven patterns of garments, the veins of leaves. The bold black line holds the entire Phad composition together."
      },
      {
        instruction: "Draw the outer border of the scroll: a decorative edge of repeating floral or geometric motifs frames the entire painting on all four sides."
      },
      {
        instruction: "Review the scroll and complete any remaining fill areas — sharpen outlines, fill white gaps, and confirm all narrative scenes read clearly from end to end. Your Phad painting is complete."
      }
    ]
  },

  // ── Pitchwai Painting (20 steps) ──────────────────────────────────────────
  pitchwai: {
    name: "Pitchwai Painting",
    subtitle: "Shrinathji & Cows — Nathdwara, Rajasthan",
    artformKeys: ["Pichhwai of Rajasthan"],
    totalSteps: 20,
    driveUrl: "",
    steps: [
      {
        instruction: "Prepare a fine-weave cotton cloth by coating it with starch paste, then polishing the dried surface with a smooth stone to create an even, semi-luminous ground for painting."
      },
      {
        instruction: "Lightly sketch the full composition in chalk or pencil. Pitchwai is a radial composition — all elements radiate outward from the central figure of Shrinathji standing with his left arm raised."
      },
      {
        instruction: "Draw the central figure of Shrinathji: a slightly stocky figure with the raised left arm, the characteristic flat-topped hairdo, and the divine peacock-feather crown."
      },
      {
        instruction: "Draw the cow herd around Shrinathji — cows stand on either side, their heads turned toward the deity in devotion. Cows are always depicted in graceful profile with large, expressive eyes."
      },
      {
        instruction: "Sketch the gopis (cowherd maidens) — rows of slim female figures flanking the cows, standing with hands raised in prayer or holding offerings of flowers and butter."
      },
      {
        instruction: "Draw kadamba trees rising symmetrically on both sides of the composition. Depict them with round leafy canopies and hanging strands of orange blooms — the signature tree of Krishna's Vrindavan."
      },
      {
        instruction: "At the base of the composition, draw a lotus pond — large circular blooms and pads fill the lower section, with ducks and fish swimming between them."
      },
      {
        instruction: "Across the top of the painting, sketch an elaborate garland of flowers suspended in arcs between the tree tops — marigolds and chameli blossoms strung on looping chains."
      },
      {
        instruction: "Add celestial elements in the sky: a large moon with a face (chandra), a radiant sun, and small deer or peacocks perched among the tree branches."
      },
      {
        instruction: "Sketch a decorative border around the entire canvas — an outer frame of repeating lotus-bud chains or scrolling vine that contains and completes the whole composition."
      },
      {
        instruction: "Begin painting the deep background. Fill the entire sky and all empty areas with a rich midnight blue or black — this dark ground is the most immediately recognisable feature of classic Pitchwai."
      },
      {
        instruction: "Apply deep green to the tree canopies and lotus leaves. Leave the flower outlines unpainted for now — they will be filled with contrasting colours in a later step."
      },
      {
        instruction: "Paint Shrinathji's body using a deep blue-black tone (Krishna's divine complexion). Fill his pitamba (dhoti) with a flat bright yellow — the contrast of blue body and yellow cloth is iconic."
      },
      {
        instruction: "Fill the gopis' garments in a range of jewel tones — deep red, saffron, pink, and olive green. Each gopi wears a slightly different colour to individualise her within the devotional group."
      },
      {
        instruction: "Paint the cows in white with subtle pink detailing around the eyes and muzzle. Decorate their bodies with small painted flower garlands in red and orange."
      },
      {
        instruction: "Fill the lotus blooms in pink and deep red, and the pads in green. Paint the marigold garland across the top in golden yellow and the chameli blossoms in white."
      },
      {
        instruction: "Add Shrinathji's elaborate jewellery — layered ratna necklaces, kundan earrings, and the ornamental waistband — using a fine brush to paint each ornament in delicate gold lines."
      },
      {
        instruction: "Paint the intricate pattern on Shrinathji's yellow pitamba — typically a geometric grid of small diamonds or floral medallions in a slightly darker gold tone."
      },
      {
        instruction: "Begin the final outline reinforcement: using a very fine brush loaded with carbon black, sharpen every figure contour, facial feature, jewellery edge, and leaf outline across the entire composition."
      },
      {
        instruction: "Complete the border decoration with repeating floral motifs in contrasting colours against the dark ground. Add final white dot accents — stars, dewdrops, and eye highlights — to bring the painting to life. Your Pitchwai painting is complete."
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
