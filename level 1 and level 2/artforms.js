/**
 * artforms.js — Chitra Katha art form data
 * Keys match EXACTLY what the Teachable Machine classifier returns
 * (after .trim() is applied in app.js — trailing spaces are stripped).
 *
 * Note: 'Sanji Art  of Uttar Pradesh' has a genuine double-space in the
 * model's label — kept here to match.
 */

const ARTFORMS = {

  "Gond Art of Madhya Pradesh": {
    name: "Gond Art",
    region: "Madhya Pradesh",
    coords: [22.5, 80.5],
    tagline: "The pulse of the forest in every line",
    history: "Gond art is one of the largest tribal art traditions in India, practised by the Gondi people of central India for centuries. Traditionally painted on the mud walls and floors of homes during festivals, it was believed to bring good luck and ward off evil. The style is instantly recognisable by its intricate patterns of dots and dashes that fill every surface — textures inspired by bark, fish scales, and feathers. In the 1980s, the late Jangarh Singh Shyam moved the tradition onto paper and canvas, bringing it to international galleries and changing the art world's relationship with Indian tribal art.",
    materials: ["Natural pigments — charcoal, coloured soil, plant juices", "Acrylic and poster colours (modern)", "Paper and canvas"],
    tools: ["Bamboo sticks", "Pen nibs", "Fingers", "Fine brushes"],
    community: "The Gondi tribal people of Mandla, Dindori, and Balaghat districts of Madhya Pradesh. The Pardhan Gond sub-group — traditionally the keepers of oral history — are the primary painters."
  },

  "Kalighat of Bengal": {
    name: "Kalighat Painting",
    region: "West Bengal",
    coords: [22.52, 88.36],
    tagline: "Sacred devotion meets sharp social wit",
    history: "Kalighat painting was born in the 19th century in the lanes around the Kalighat Kali temple in Kolkata. Patua scroll painters (Chitrakaras) relocated near the temple to sell devotional images to pilgrims. Their style — bold outlines, flat colour washes, and fluid brushwork — was revolutionary. Over time, subjects shifted from gods to biting social commentary on the Bengali colonial elite, making Kalighat one of the earliest traditions of social satire in Indian art. The style later influenced Jamini Roy, one of India's most celebrated modernists.",
    materials: ["Watercolour on mill-made paper", "Natural mineral pigments", "Chalk whites"],
    tools: ["Fine brushes, traditionally squirrel-hair", "Reed pens for outlines"],
    community: "The Patua or Chitrakar community of West Bengal, centred around the Kalighat neighbourhood of Kolkata and the Midnapore district villages."
  },

  "Soharai of Jharkhand": {
    name: "Sohrai Painting",
    region: "Jharkhand",
    coords: [24.0, 85.3],
    tagline: "A harvest celebration painted on living walls",
    history: "Sohrai is both a harvest festival and an art form of the tribal communities of Hazaribagh, Jharkhand. Each year after the harvest, women repaint the walls of their homes with animals, trees, and geometric patterns — a celebration of the cattle and the land that sustains the community. The art is tied to animist beliefs: each motif carries meaning connected to fertility, protection, and gratitude. The natural earth pigments are sourced entirely from the local landscape — white clay, red and black ochre, and manganese.",
    materials: ["White clay (dudhi mitti)", "Red ochre (geru)", "Black manganese oxide", "Yellow ochre"],
    tools: ["Fingers", "Chewed datun (neem) sticks", "Cut twigs"],
    community: "Women of the Santhali, Oraon, and Munda tribal communities in the Hazaribagh region of Jharkhand. The art is passed exclusively between women."
  },

  "Tanjore Painting of Tamil Nadu": {
    name: "Tanjore Painting",
    region: "Tamil Nadu",
    coords: [10.78, 79.13],
    tagline: "Devotion rendered in gold and gemstone",
    history: "Tanjore painting flourished under the Nayak rulers of Thanjavur in the 16th century and reached its peak under the Maratha court. These richly textured devotional works are built up in layers — chalk and glue are applied to a cotton-cloth-covered wooden board, gold foil is pressed onto raised gesso forms, and semi-precious stones inlaid as jewellery. The result is an icon that seems to glow from within. Subjects are almost exclusively divine — Vishnu, Krishna, and Lakshmi — depicted with serene three-quarter-face compositions.",
    materials: ["Wooden board covered in cotton cloth", "Chalk powder and glue (gesso base)", "Gold foil", "Semi-precious stones and coloured glass", "Natural and synthetic pigments"],
    tools: ["Fine brushes", "Stylus for embossing gesso", "Burnishing tools for gold"],
    community: "Traditional artist families (Nayaka community) of Thanjavur, Tamil Nadu. The craft is passed down through family workshops called shilpa shalas."
  },

  "Kalamkari Of Tamil Nadu": {
    name: "Kalamkari",
    region: "Andhra Pradesh",
    coords: [14.5, 79.5],
    tagline: "A pen's journey through myth and cloth",
    history: "Kalamkari — literally 'pen work' (kalam = pen, kari = craft) — is a 3,000-year-old tradition of hand-painting or block-printing on cloth using natural dyes. Two distinct schools exist: the Srikalahasti style is entirely hand-drawn with a bamboo pen, depicting temple narratives from the Ramayana and Mahabharata; the Machilipatnam style uses hand-carved wooden blocks and shows Persian floral influence from the Mughal period. Both traditions rely on a complex 17-step process of mordanting, dyeing, and washing.",
    materials: ["Handspun cotton or silk", "Natural dyes — indigo, pomegranate rind, iron rust, myrobalan", "Mordants — alum and iron"],
    tools: ["Bamboo pen (kalam) tipped with a fibre bundle", "Hand-carved wooden blocks (Machilipatnam style)"],
    community: "Artists of Srikalahasti (Devanga caste) and Machilipatnam (Khatri community) in Andhra Pradesh."
  },

  "Sanji Art  of Uttar Pradesh": {
    name: "Sanji",
    region: "Uttar Pradesh / Rajasthan",
    coords: [27.5, 77.7],
    tagline: "Stencilled flowers as an offering to Krishna",
    history: "Sanji is a devotional stencil art associated with the worship of Lord Krishna, practiced in the Mathura-Vrindavan region and Rajasthan. During the Sharad season (autumn), priests and devotees create elaborate floor and wall patterns using hand-cut stencils and natural materials — flower petals, coloured powders, and leaves. In temples, Sanji was traditionally made with cow dung paste on the floor, then decorated with pigments. The patterns depict scenes from Krishna's life with intricate geometric borders.",
    materials: ["Flower petals", "Coloured powders (gulal)", "Leaves and seeds", "Cow dung paste (traditional)"],
    tools: ["Handmade stencils cut from bamboo or thick paper", "Hands and fingers"],
    community: "Brahmin priests and devotees of the Braj region (Mathura-Vrindavan, UP) and Rajasthan, particularly around Jodhpur and Jaipur."
  },

  "Warli oh Maharashtra": {
    name: "Warli Painting",
    region: "Maharashtra",
    coords: [19.9, 72.8],
    tagline: "The geometry of community life",
    history: "Warli painting is one of India's oldest surviving art forms, with roots dating to at least 2500 BCE — contemporaneous with Indus Valley civilisation imagery. The Warli tribe of Palghar district traditionally painted on inner walls of homes as part of wedding rituals and harvest ceremonies. The art uses only three geometric shapes: circles (sun and moon), triangles (mountains and trees), and squares (sacred enclosures) — combined into vivid narrative scenes of daily and ceremonial life. White rice paste on a mud-brown wall is the defining visual signature.",
    materials: ["White rice paste", "Mud and cow dung (background preparation)", "Paper and cloth (contemporary)"],
    tools: ["Bamboo sticks chewed at one end", "Fingers"],
    community: "The Warli tribe of Palghar, Thane, and Nashik districts of Maharashtra. Women were the original painters; men began participating from the 1970s."
  },

  "Phad of Rajasthan": {
    name: "Phad Painting",
    region: "Rajasthan",
    coords: [25.3, 74.6],
    tagline: "A portable temple that travels with its story",
    history: "Phad is a large-format scroll painting from Bhilwara and Shahpura, Rajasthan, used as a mobile shrine by Bhopa priest-performers. Scrolls can be 15 to 30 feet long and depict the epic lives of local folk deities Devnarayan and Pabuji in intricate, comic-strip-like panels. The Bhopa carries the Phad on his back, travelling between villages to perform all-night oral epics accompanied by the Ravan Hatta instrument. Traditionally the Phad was never sold and was ceremonially immersed in a river when worn out.",
    materials: ["Handspun cotton cloth", "Natural vegetable dyes", "Mineral pigments"],
    tools: ["Fine brushes", "Bamboo pen", "Ruler for panel borders"],
    community: "The Joshi (Chipa) caste of painters in Bhilwara and Shahpura, Rajasthan. The Bhopa-Bhopi priests are the traditional carriers of the Phad."
  },

  "Pichhwai of Rajasthan": {
    name: "Pichhwai Painting",
    region: "Rajasthan",
    coords: [24.93, 73.82],
    tagline: "A living backdrop to the divine",
    history: "Pichhwai — from Sanskrit 'pichhe' (behind) and 'wai' (hanging) — are large devotional cloth paintings hung behind the idol of Shrinathji in the Nathdwara temple near Udaipur. A different Pichhwai is displayed for each festival, season, and time of day, transforming the deity's setting across the year. The paintings depict Krishna's life — Raas Leela, the lotus ponds of Vrindavan, cow-herding scenes — in deep blues, gold, and lotus pink. Each painting may take months to complete.",
    materials: ["Cotton or silk cloth", "Natural mineral dyes", "Gold paint (sona-roopa)"],
    tools: ["Fine squirrel-hair brushes", "Compass for circular compositions"],
    community: "Artist families — primarily the Usta community and Nathdwara Brahmin painters — of Nathdwara, Rajasthan. Several families have practised the tradition for over 400 years."
  },

  "Madhubani of Bihar": {
    name: "Madhubani Painting",
    region: "Bihar",
    coords: [26.37, 86.07],
    tagline: "The mythology of Mithila in every line",
    history: "Madhubani — also called Mithila painting — originates in the Mithila region of Bihar. Its origins are mythological: King Janaka is said to have commissioned paintings to celebrate the wedding of his daughter Sita to Ram. Traditionally painted by women on freshly plastered walls and floors of homes, the art came to international attention in 1967 when artists began painting on paper during a severe drought, transforming a household ritual into a livelihood. Different castes paint different subjects: Brahmin women depict deities; the Dusadh community paints the snake goddess Kali.",
    materials: ["Natural dyes — turmeric (yellow), indigo (blue), soot (black), sindoor (red)", "Cow dung paste on walls", "Handmade paper"],
    tools: ["Bamboo twigs", "Matchsticks", "Fingers", "Fine brushes"],
    community: "Women of the Mithila region across multiple castes — Brahmin, Kayastha, and Dusadh — centred in Madhubani and Darbhanga districts, Bihar."
  },

  "Thangka Painting of Sikkim": {
    name: "Thangka Painting",
    region: "Sikkim / Ladakh",
    coords: [27.5, 88.5],
    tagline: "A scroll that opens a portal to enlightenment",
    history: "Thangka are Buddhist scroll paintings on cotton or silk, created as objects of devotion, meditation, and religious teaching. Every element — figure, gesture, colour, and symbol — is precisely prescribed by ancient iconographic texts, and a student painter may spend years learning to draw a single deity correctly. The paintings depict Buddhas, Bodhisattvas, mandalas, and scenes from the life of Siddhartha. Traditional Thangkas use mineral pigments that can last for centuries, with a final stage of gilding in pure gold powder.",
    materials: ["Cotton or silk canvas", "Mineral pigments — malachite, lapis lazuli, cinnabar", "Gold powder", "Animal-hide glue sizing"],
    tools: ["Fine squirrel-hair brushes (some with a single hair)", "Compass and ruler for geometric mandalas", "Burnishing tools for gold"],
    community: "Tibetan Buddhist monks and lay artists in Sikkim, Ladakh, Dharamsala, and Spiti. Training occurs in monastic settings and takes 5–10 years to reach mastery."
  },

  "Kolam of Tamil Nadu": {
    name: "Kolam",
    region: "Tamil Nadu",
    coords: [11.1, 78.7],
    tagline: "A daily prayer drawn at the threshold of dawn",
    history: "Kolam is a living ritual art practised every morning by millions of women across Tamil Nadu, Kerala, Karnataka, and Andhra Pradesh. At dawn, the threshold of the home is swept clean and the Kolam is drawn freehand in rice powder — an offering of food to insects and birds, a gesture of ahimsa (non-harm) at the start of each day. The intricate geometric patterns are drawn by placing dots in a grid and looping continuous lines around them. Patterns vary by region, occasion, and family tradition.",
    materials: ["Rice flour or powder", "White powdered limestone", "Coloured chalk powders", "Flower petals for festival Kolams"],
    tools: ["Fingers and thumb", "Dry powder pinched and trailed between thumb and forefinger"],
    community: "Practised by women across all communities in Tamil Nadu and neighbouring states. Patterns are passed from mother to daughter from early childhood."
  },

  "Talpatra Chittar of Odisha": {
    name: "Talpatra Chittara",
    region: "Odisha",
    coords: [20.0, 85.8],
    tagline: "Stories engraved on leaves of time",
    history: "Talpatra Chittara is the ancient art of illustrating palm leaf manuscripts, practised in Odisha for over a thousand years. Dried palm leaves are cut into uniform strips and engraved with a pointed metal stylus; lampblack or charcoal ink is then rubbed across the surface and settles into the cuts, revealing the image when wiped clean. The Chitrakara caste created entire illustrated manuscripts of the Ramayana, Mahabharata, Gita Govinda, and Odishan folklore.",
    materials: ["Dried palm leaves (tala patra)", "Lampblack or charcoal ink", "Turmeric solution for preservation"],
    tools: ["Metal stylus (iron writing pen)", "Smooth polishing stone"],
    community: "The Chitrakara caste of painters in Puri district and Raghurajpur heritage village, Odisha, where nearly every family continues the tradition."
  },

  "Aipan Art of Uttrakhand": {
    name: "Aipan",
    region: "Uttarakhand",
    coords: [29.6, 79.6],
    tagline: "Sacred geometry from the Himalayan foothills",
    history: "Aipan is a ritual floor and wall art form of the Kumaon region of Uttarakhand, drawn by women during festivals, births, weddings, and worship ceremonies. The background is prepared with a wash of red clay (geru), onto which intricate white patterns are drawn in rice paste using the ring finger. Each design corresponds to a specific deity or occasion: the Shiva Panchayatan for Shiva worship, the Saptmatrika design for birth ceremonies, and Lakshmi's feet for prosperity rituals. Aipan is ephemeral by nature — made to mark a sacred moment and washed away by rain and time.",
    materials: ["Red clay (geru)", "White rice paste (pithya)", "Walls and floors of homes"],
    tools: ["Ring finger of the right hand", "Cloth wick soaked in rice paste"],
    community: "Kumaoni Brahmin women of the Almora, Pithoragarh, and Nainital districts of Uttarakhand. Patterns are memorised and passed through female lineage."
  }

};