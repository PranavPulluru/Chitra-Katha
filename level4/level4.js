/**
 * level4/level4.js — Chitra Katha Level 4: Compare & Contrast
 * =============================================================
 * Self-contained module; depends only on Level3v2 (for fallback)
 * and the screen HTML in index.html.
 */

window.Level4 = (() => {

/* ── Art form display names ──────────────────────────────────────────────── */
// ARTFORM_TO_TUTORIAL is already declared globally by level3v2/data.js

const ART_DISPLAY_NAMES = {
  kalighat:  "Kalighat of Bengal",
  sohrai:    "Sohrai of Jharkhand",
  warli:     "Warli of Maharashtra",
  gond:      "Gond of Madhya Pradesh",
  talapatra: "Talapatra Chitra of Odisha"
};

/* ── Annotation data ──────────────────────────────────────────────────────── */

const ANNOTATIONS = {

  kalighat: [
    {
      id: "k1",
      label: "Sweeping Contour Stroke",
      top: "8%", left: "10%", width: "38%", height: "28%",
      title: "The Single-Stroke Contour",
      body: "Kalighat painters loaded a thick squirrel-hair brush with water and dipped just the tip in black ink, then drew the entire body outline — head, torso, arm — in a single continuous sweeping motion. This gave figures a tubular, sculptural mass and a plastic, three-dimensional feeling from just one brushstroke. The technique demanded absolute confidence: no corrections were possible on the absorbent mill-made paper."
    },
    {
      id: "k2",
      label: "Elongated Eyes",
      top: "8%", left: "52%", width: "36%", height: "20%",
      title: "Stylised Elongated Eyes",
      body: "The dramatically elongated, fish-shaped eyes are one of Kalighat's most recognisable features. Painted with short, brisk black strokes, they convey intense emotion — divine power in deities, satirical mockery in 'babu' (bourgeois) figures. The eyes are disproportionately large relative to the face, a deliberate exaggeration that commands the viewer's attention and gives the figure an almost iconic, mask-like quality."
    },
    {
      id: "k3",
      label: "Flat Colour Wash",
      top: "38%", left: "10%", width: "55%", height: "30%",
      title: "Transparent Colour Wash",
      body: "Unlike traditional Indian tempera which used opaque, layered pigments, Kalighat artists applied colour as a single transparent wash over the outlined figure. The pigments — originally natural vegetable dyes like turmeric yellow, beetroot red, and Aparajita-flower blue — were diluted and brushed on quickly in one pass, leaving the paper grain slightly visible. This transparency created luminosity and kept production fast enough for a mass souvenir market."
    },
    {
      id: "k4",
      label: "Plain Background",
      top: "70%", left: "5%", width: "90%", height: "22%",
      title: "The Deliberately Empty Background",
      body: "Kalighat painters radically broke from earlier Indian miniature traditions by stripping away all background detail — no landscapes, no architectural settings, no decorative borders. The subject floats on bare white or cream paper. This was a conscious design choice shaped by the need for speed (paintings were produced and sold to temple pilgrims within hours) and by the urban aesthetic of colonial Calcutta, which favoured a bold, poster-like visual language over narrative density."
    },
    {
      id: "k5",
      label: "Thick Black Outline",
      top: "38%", left: "68%", width: "28%", height: "30%",
      title: "The Defining Black Outline",
      body: "A distinctive thick black line — drawn with a flat brush loaded with lamp-black ink — outlines the 'pad' (border or hem) of garments and demarcates major body sections. This bold outline creates a graphic, almost woodblock-print quality that makes Kalighat figures instantly legible from a distance. It is separate from the finer detail lines used for hair (painted as a solid black block), fingers, and drapery folds."
    }
  ],

  sohrai: [
    {
      id: "s1",
      label: "Red Ancestor Lines",
      top: "5%", left: "5%", width: "90%", height: "20%",
      title: "The Red Lines of Ancestry",
      body: "In Sohrai painting, the composition always begins with two parallel red lines drawn across the surface. These are not decorative — they carry profound ritual meaning. The red colour, derived from Lal matti (red oxide / geru earth), represents the blood of ancestors, fertility, and the life force. By painting these lines first, the artist connects the harvest celebration to her lineage, affirming the continuity between the living community and those who came before."
    },
    {
      id: "s2",
      label: "Black Shiva Line",
      top: "22%", left: "5%", width: "90%", height: "15%",
      title: "The Black Line of Eternity",
      body: "Following the red ancestor lines, a thick black line is drawn. This line represents Lord Shiva and the concept of eternal death — the counterpoint to the red line's vitality. In Sohrai cosmology, these two lines together hold the world in balance: red life and black eternity, creation and dissolution. The black pigment comes from Kali matti, manganese-rich black earth found near village sites."
    },
    {
      id: "s3",
      label: "X-Ray Animal",
      top: "35%", left: "15%", width: "50%", height: "38%",
      title: "X-Ray View of Animals",
      body: "One of Sohrai's most distinctive features is the 'X-ray' representation of animals — particularly cows, deer, tigers, and elephants — where the interior of the animal is rendered visible. The body outline is drawn, then the inner space is filled with concentric circles, geometric patterns, or smaller shapes, making the creature appear transparent. This technique reflects the tribal belief that the internal essence of a living being is as important — perhaps more important — than its outer form."
    },
    {
      id: "s4",
      label: "Comb Sgraffito Texture",
      top: "35%", left: "68%", width: "27%", height: "38%",
      title: "Comb-Scratch (Sgraffito) Texture",
      body: "A key Sohrai technique is sgraffito: a black manganese base is prepared on the mud wall, then a coat of white Duddi matti (white clay) is applied over it. Before the white layer fully dries, a broken comb, fingernail, or chewed stick is dragged through it, scratching away the white to reveal the black beneath. This creates intricate feather-like, bark-like, or hatched textures that are unique to this region. No two pieces ever look identical because the artist works by feel and instinct."
    },
    {
      id: "s5",
      label: "Lotus / Kamalban",
      top: "75%", left: "20%", width: "60%", height: "20%",
      title: "Kamalban — Forest of Lotuses",
      body: "The lotus (kamal) is the most sacred and visually complex motif in Sohrai. The Kurmi community of Bhelwara village is especially known for elaborate Kamalban compositions — dense, overlapping lotus forms rendered through repeated parallel line work, each petal carefully stroked with a cloth-swab dipped in pigment. Despite appearing complex, the forms are built from a vocabulary of just a few repeated marks: parallel lines, spirals, and dots, assembled intuitively without any preliminary sketch."
    }
  ],

  warli: [
    {
      id: "w1",
      label: "Chauk (Sacred Square)",
      top: "10%", left: "30%", width: "40%", height: "35%",
      title: "The Chauk — Sacred Central Square",
      body: "The square (chauk or chaukat) is the most ritually significant element in Warli painting and always occupies the visual centre of a ceremonial composition. Unlike the circle and triangle which Warli artists observed in nature, the square is considered a human invention — representing a sacred enclosure, a piece of claimed land, or a ritual space. A Devchauk contains Palghat Devi, the mother goddess of fertility. A Lagnachauk marks a wedding ceremony. No Warli ritual painting is complete without this central anchor."
    },
    {
      id: "w2",
      label: "Triangular Figure",
      top: "45%", left: "10%", width: "35%", height: "35%",
      title: "The Two-Triangle Human Figure",
      body: "People and animals in Warli art are represented by two inverted triangles joined at their tips — the upper triangle represents the torso, the lower the pelvis. This precarious, top-heavy balance is not accidental: it symbolises the fragile equilibrium of the universe. In movement (dancing, running, farming), the triangles tilt and shift, conveying energy through geometry alone. Faces are simple circles with no distinguishing features — identity comes from posture and context, not individual likeness."
    },
    {
      id: "w3",
      label: "Tarpa Dance Circle",
      top: "45%", left: "50%", width: "45%", height: "35%",
      title: "The Tarpa Dance — Symbol of Unity",
      body: "The most iconic Warli motif is a ring of figures holding hands and dancing in a circle around a musician playing the tarpa (a trumpet-like wind instrument). The circle represents the cycle of life and the communal spirit of the tribe. Every figure in the chain is equal — no hierarchy, no front or back. The dancer who faces the tarpa player must follow his lead: the direction of the dance changes with the music. This motif appears on nearly every contemporary Warli work and is recognised worldwide."
    },
    {
      id: "w4",
      label: "White Rice Paste on Red",
      top: "5%", left: "5%", width: "25%", height: "42%",
      title: "White on Red — The Warli Palette",
      body: "Warli's entire colour philosophy rests on a single contrast: white drawn on a dark red-brown background. The white pigment — traditionally a paste of rice flour, water, and tree gum — is the only paint colour used. The background is prepared with a coating of red geru (iron-oxide earth) mixed with cow dung on the mud wall. This severe two-tone restriction forces all expression into line quality, density, and composition. When Warli moved onto paper and canvas in the 1970s, artists sometimes introduced other natural pigments (indigo, turmeric, black), but purists maintain that the white-on-red is the authentic visual language of the tradition."
    },
    {
      id: "w5",
      label: "Nature Narrative Scene",
      top: "5%", left: "68%", width: "27%", height: "40%",
      title: "Nature as Narrative — The Outer Ring",
      body: "Surrounding the chauk in a Warli ritual painting are dense scenes of daily life: hunting with bows, harvesting, fishing, ploughing, animals, trees, birds, and water. These scenes are not decorative filler — they constitute a visual record of the community's way of life, encoded in a symbolic language that initiated viewers can read like a text. The paintings on the outer walls of homes (painted by young girls, not the ritual specialists who paint the chauk) often focus purely on these nature scenes without any central motif."
    }
  ],

  gond: [
    {
      id: "g1",
      label: "Dot & Dash Fill",
      top: "5%", left: "5%", width: "55%", height: "40%",
      title: "Dots, Dashes & Lines as Texture",
      body: "The most defining technical feature of Gond (Jangarh Kalam) painting is the way interior space is filled: not with flat colour, but with dense fields of dots, dashes, parallel lines, cross-hatching, comb-like strokes, and tiny geometric marks. No two areas of the same animal or tree are filled the same way — each zone gets its own texture vocabulary, making the painting shimmer and vibrate. The Pardhan Gond community inherited this sensibility from their role as bards: their paintings move like music, every mark a rhythm."
    },
    {
      id: "g2",
      label: "Peacock / Bird Motif",
      top: "5%", left: "62%", width: "33%", height: "45%",
      title: "The Peacock — Spirit of the Forest",
      body: "The peacock is the single most common motif in Gond painting and carries layered significance. As an animal of the forest canopy, it embodies the Gond belief that every creature is inhabited by a spirit (dev). In paintings, peacocks are almost never rendered naturalistically — instead, their tail feathers become dense abstract pattern-fields, their bodies merge with tree branches, and two peacocks facing each other across a shared trunk represent the balance of complementary forces in the forest ecosystem."
    },
    {
      id: "g3",
      label: "Tree of Life",
      top: "45%", left: "20%", width: "55%", height: "40%",
      title: "The Mahua Tree — Tree of Life",
      body: "Trees — especially the Mahua (Madhuca longifolia) — are the emotional and spiritual centre of Gond art. The Mahua provides food (its flowers are eaten and fermented into liquor), medicine, and shade. In paintings, it typically dominates the composition, its branches interlocking with animals and birds in a single organic web. The way Gond artists render tree bark — alternating rows of fish-scale patterns, curved comb lines, or half-moon shapes — is one of the most recognisable stylistic signatures of the tradition."
    },
    {
      id: "g4",
      label: "Vibrant Flat Colour Zones",
      top: "45%", left: "5%", width: "13%", height: "40%",
      title: "Bold Colour Zones",
      body: "While the texture work is in black ink, Gond paintings use vivid, contrasting flat-colour fills to separate zones: red, yellow, blue, orange, green. These were originally derived from organic sources — coloured clay, charcoal, plant sap, cow dung, and crushed stones. Today acrylic and poster colours are common. The colours rarely blend or shade into one another — instead, the sharp boundary between a red zone and a yellow zone creates the same graphic impact as the black outlines, making even complex compositions instantly legible."
    },
    {
      id: "g5",
      label: "Interlocking Composition",
      top: "5%", left: "5%", width: "15%", height: "40%",
      title: "The Interconnected World",
      body: "Unlike most folk art traditions where figures are isolated on a background, Gond compositions treat the entire picture surface as a single interconnected ecosystem. Animals emerge from trees, birds nest inside animal forms, roots connect to the margins of the painting. This reflects the Gond cosmological belief that the spirit world permeates the physical — the boundary between a tiger and the forest it inhabits, or between a river fish and the water around it, is not a boundary at all. The painting has no true background because everything is alive."
    }
  ],

  talapatra: [
    {
      id: "t1",
      label: "Iron Stylus Engraving",
      top: "5%", left: "5%", width: "90%", height: "22%",
      title: "The Lekhani — Iron Stylus Engraving",
      body: "Talapatra Chitra begins not with paint but with a sharp iron stylus called a Lekhani. The artist etches lines directly into the surface of a dried, treated palm leaf — no preliminary pencil sketch, no corrections possible. The pressure of the stylus creates a groove in the leaf's waxy surface. Once the engraving is complete, lamp-black (charcoal soot mixed with oil) is rubbed into the entire surface. When the excess is wiped away, the black remains only in the etched grooves, making every line visible as a dark mark against the natural golden-tan of the palm leaf."
    },
    {
      id: "t2",
      label: "Ornate Border Frame",
      top: "5%", left: "5%", width: "90%", height: "22%",
      title: "The Decorative Border System",
      body: "Every Talapatra composition is enclosed within a multi-layered border: typically an outer geometric frame, then a band of floral or leaf patterns, then an inner line before the narrative scene begins. These borders are not decorative afterthoughts — they are structural, defining the sacred space of the image. The border vocabulary (lotus petals, scrolling vines, diamond grids) is inherited from the architectural ornamentation of Odishan temples, particularly Puri's Jagannath Temple, to which the Chitrakara families have been ritually connected for centuries."
    },
    {
      id: "t3",
      label: "Profile Figure with Ornaments",
      top: "27%", left: "20%", width: "60%", height: "45%",
      title: "Elongated Profile Figures & Jewellery Detail",
      body: "Human figures in Talapatra Chitra are always shown in strict profile — never three-quarter or frontal. They are elongated and stylised, with large eyes, elaborate headdresses, and intricate jewellery (earrings, necklaces, armlets) rendered in minute engraved detail. On the original palm leaf surface, these ornamental details are achieved with clusters of tiny dots and curved marks. The conventions for representing deities (mudra hand positions, divine attributes like lotuses and conch shells) are fixed by canonical temple iconography and passed down within Chitrakara families without deviation."
    },
    {
      id: "t4",
      label: "Natural Palm Leaf Ground",
      top: "74%", left: "5%", width: "90%", height: "20%",
      title: "The Palm Leaf Canvas",
      body: "The medium itself is inseparable from the art form. Palm leaves (Tala patra) are harvested, boiled to soften them, treated with a turmeric solution (which gives the leaf its golden hue and acts as a natural insecticide), then dried in the sun for months. Leaves are cut to uniform size and strung together at both ends with thread to form a folding manuscript called a pothi. The natural grain and honey-brown warmth of the palm leaf sets the tonal ground for the entire composition — the engraved black lines glow against it rather than sitting flat."
    },
    {
      id: "t5",
      label: "Mythological Narrative",
      top: "27%", left: "5%", width: "13%", height: "45%",
      title: "Narrative Sequential Storytelling",
      body: "Unlike most easel paintings, Talapatra Chitra is fundamentally sequential — it reads like a book. Each strung-together leaf panel contains one scene in a larger mythological narrative (from the Ramayana, Mahabharata, or Jagannath's divine stories). When unfolded, a complete pothi might contain 12 to 30 connected panels. This sequential structure reflects the art form's origin as illustrated sacred manuscripts — the same leaf-manuscripts in which Vedic texts, astrological charts, and temple records were preserved in Odisha for over a millennium."
    }
  ]

};

/* ── Comparison data ──────────────────────────────────────────────────────── */

const _COMPARISONS_RAW = {

  "gond__kalighat": {
    cards: [
      {
        category: "Visual Style & Composition",
        text: "Kalighat painting is dramatically spare — a single figure or pair of figures floats on a plain white background with no setting or context. Every element that is not the subject has been stripped away. Gond painting is the opposite: the entire picture plane is packed with interconnected forms — animals, trees, birds, and spirits merge into a single dense ecosystem where there is no empty background because everything is alive. Where Kalighat creates impact through isolation and bold silhouette, Gond creates it through complexity and pattern-density."
      },
      {
        category: "Colour Palette",
        text: "Kalighat uses a restrained set of flat, transparent watercolour washes — red, black, yellow, and occasional blue-green — applied quickly over bold outlines on white paper. Gond paintings explode with vivid, saturated zones of red, blue, yellow, orange, and green, sharply divided by black outlines. Both traditions originally used natural pigments, but Gond's palette is far more chromatic and high-contrast. In Kalighat, colour is secondary to line; in Gond, colour and texture are co-equals."
      },
      {
        category: "Brushwork & Line Quality",
        text: "Kalighat's most celebrated achievement is its brushwork: a single, fluid, sweeping stroke that builds a figure's contour and volume simultaneously — described as among the most seamless in all Indian art. Gond painting, by contrast, is built from thousands of tiny marks — dots, dashes, parallel lines, cross-hatching — assembled slowly into a dense textured whole. Kalighat demands instant mastery and absolute confidence in a single gesture; Gond rewards patient accumulation of small, repeated actions."
      },
      {
        category: "Materials & Medium",
        text: "Kalighat artists worked on mill-made or hand-made paper using squirrel-hair brushes, watercolour pigments, and lamp-black ink — all lightweight, portable materials suited to rapid production for a pilgrimage market. Gond paintings began on the mud walls of village homes using natural earth pigments and finger-tips or twigs. Contemporary Gond art has moved onto paper and canvas using poster colours and fine synthetic brushes, making it more durable and suitable for the gallery market."
      },
      {
        category: "Cultural & Regional Origin",
        text: "Kalighat emerged in 19th-century colonial Calcutta — an urban, cosmopolitan, market-driven art created by migrant Patua artists responding to the commercial and social upheavals of the British Raj. It is deeply tied to the city, to satire, and to the interface between Indian tradition and Western modernity. Gond art comes from the tribal forest communities of central India — Madhya Pradesh, Chhattisgarh — rooted in animistic belief, oral tradition, and the spiritual relationship between the Pardhan Gond community and the natural world."
      },
      {
        category: "Common Motifs & Subjects",
        text: "Kalighat subjects range from Hindu deities (Kali, Durga, Krishna) to sharp social satire: hypocritical priests, hen-pecked husbands, fashionable courtesans, and colonial collaborators. The figures are always human or anthropomorphic, always socially legible. Gond paintings are overwhelmingly focused on the natural world — trees, peacocks, tigers, fish, snakes — read through the lens of tribal mythology. Deities appear but are often depicted in zoomorphic or symbolic forms, emerging from forest rather than temple contexts."
      },
      {
        category: "Difficulty & Accessibility",
        text: "Kalighat's sweeping single-stroke contours look simple but are extraordinarily difficult to execute — the line must be confident, fluid, and structurally correct in a single uninterrupted motion. This is a lifelong skill. Gond painting is more accessible in structure: the dot-and-dash fill technique can be learned progressively, with the density and intricacy increasing as the artist develops. This makes Gond a more approachable starting point for learners, though true mastery of its compositional ecosystem thinking takes years."
      }
    ]
  },

  "kalighat__sohrai": {
    cards: [
      {
        category: "Visual Style & Composition",
        text: "Kalighat is a paper-based, single-image art form: one figure or a small group, centred, with all background stripped away. Sohrai is a mural tradition — it wraps around the entire exterior and interior of a mud house, continuous and environmental, with compositions that flow from wall to wall. A Kalighat painting is a discrete object to be sold and framed; Sohrai is an immersive environment that transforms the entire household into a sacred space for the harvest festival."
      },
      {
        category: "Colour Palette",
        text: "Kalighat's palette is bright but limited — watercolour washes in red, yellow, black, and occasional blue on white paper. Sohrai's palette is earthy and symbolic: red (Lal matti / geru) representing ancestral blood, black (Kali matti / manganese) representing eternity and Lord Shiva, white (Duddi matti / white clay) representing food, and yellow ochre (Pila matti). Each colour in Sohrai carries a specific ritual meaning within the harvest cosmology, whereas Kalighat colour is primarily expressive and decorative."
      },
      {
        category: "Brushwork & Line Quality",
        text: "Kalighat is defined by its brushwork — fluid, rapid, gestural strokes made with squirrel-hair brushes. The line in Kalighat is always the product of speed and confidence. Sohrai has no brushes in the Western sense: artists use their fingers, broken comb pieces, chewed datoon twigs, and cloth swabs. The marks are pressed, scraped, and daubed rather than stroked. The sgraffito technique — scratching white clay over a black base with a comb — produces a textured, relief-like quality completely unlike any painted line."
      },
      {
        category: "Materials & Medium",
        text: "Kalighat uses manufactured paper and commercial or natural pigments in a diluted watercolour technique — a portable, reproducible format. Sohrai is inseparable from its medium: the mud wall of a tribal home, replastered after the monsoon, layered with coloured earth pigments, and worked while still wet. Moving Sohrai onto paper (which has happened for commercial purposes) fundamentally changes its character — it loses the relief texture of sgraffito and the scale that makes it architecturally immersive."
      },
      {
        category: "Cultural & Regional Origin",
        text: "Kalighat is urban and market-driven, born in 19th-century Kolkata from the collision of folk tradition and colonial modernity. It is art made for an audience of strangers — pilgrims, tourists, social critics. Sohrai is rural and communal, practiced by women of the Santhal, Munda, Oraon, Kurmi, and Agaria tribes of Jharkhand exclusively for the Sohrai harvest festival. It is art made for the household community and the gods, not for sale — though commercialisation on paper has changed this in recent decades."
      },
      {
        category: "Common Motifs & Subjects",
        text: "Kalighat depicts human figures — deities and contemporary social types — with sharp outlines, emotional expressiveness, and narrative clarity. Sohrai is almost entirely non-human: cattle (the sacred animals of the festival), wild animals like tigers and nilgai, birds like peacocks and sparrows, trees, lotus flowers, and the geometric forms of the natural world. The central deity of Sohrai is Pashupati — Lord of Animals — depicted as a guiding presence among cattle, not in the anthropomorphic form typical of Kalighat deities."
      },
      {
        category: "Difficulty & Accessibility",
        text: "Kalighat demands mastery of a very specific brushwork technique that is difficult to teach and nearly impossible to approximate without years of practice. Sohrai's techniques are diverse — some (like fingerprint dots and basic line work) are immediate and instinctive; others (like the fine-comb sgraffito textures of the Kurmi community) require skill developed over many festival seasons. Sohrai is taught mother to daughter within the community, making it culturally closed but technically gradated — there is a gentle on-ramp for beginners."
      }
    ]
  },

  "kalighat__talapatra": {
    cards: [
      {
        category: "Visual Style & Composition",
        text: "Both Kalighat and Talapatra Chitra depict figures in profile against a plain, uncluttered ground — but they arrive at this similarity from completely different directions. Kalighat's plainness is a radical modernist choice: the urban Patua artists deliberately eliminated the decorative borders and busy backgrounds of earlier folk traditions to achieve maximum visual impact for a mass market. Talapatra's plain ground is the natural colour of the palm leaf itself — the 'background' is simply the unconquered material, framed by elaborate multi-layered ornamental borders that Kalighat never uses."
      },
      {
        category: "Colour Palette",
        text: "Kalighat is a watercolour tradition, applying transparent washes of red, yellow, black, and occasional blue-green — bright, fast, and gestural. Talapatra Chitra in its purest palm-leaf form is essentially monochrome: black lamp-soot rubbed into engraved grooves against the golden-tan of the palm leaf. When natural colour pigments (turmeric yellow, charcoal black, geru red) are added, they are used sparingly to highlight specific elements — garment colours, ornaments — within an otherwise two-tone composition. Kalighat is assertively colourful; Talapatra is quietly restrained."
      },
      {
        category: "Brushwork & Line Quality",
        text: "Kalighat line is the mark of a brush — fluid, calligraphic, varying in thickness from the thick-loaded sweep that builds volume to the thin, brisk strokes that define fingers and eyelashes. Talapatra line is the mark of an iron stylus — it has a uniform, engraved quality, precise and deliberate. The stylus cannot vary pressure the way a brush does, so all expressiveness must come from the direction, length, and density of the etched lines, not from their weight. Both require enormous confidence — neither allows correction."
      },
      {
        category: "Materials & Medium",
        text: "Kalighat is produced on paper using water-based pigments — ephemeral, lightweight, and intended as an affordable souvenir. Talapatra Chitra's medium is the palm leaf itself, prepared through months of drying, boiling, and turmeric treatment. Palm leaf is naturally durable — manuscripts have survived centuries in Odisha's archival collections. The medium's permanence reflects Talapatra's original sacred function: to preserve and transmit religious texts, genealogies, and divine narratives across generations."
      },
      {
        category: "Cultural & Regional Origin",
        text: "Kalighat emerged in 19th-century colonial Calcutta — secular, satirical, and responsive to contemporary social events. It is one of India's first explicitly urban folk art forms. Talapatra Chitra originates in the sacred relationship between the Chitrakara artist families and the Jagannath temple in Puri, Odisha — one of India's most important pilgrimage centres. The art is devotional in the deepest sense: Talapatra paintings stand in for the deities in the temple sanctum during ritual seclusion. It is ancient, canonical, and theologically conservative."
      },
      {
        category: "Common Motifs & Subjects",
        text: "Kalighat's motif range is uniquely broad for a folk tradition — Hindu deities share space with satirical portraits of 'babus', courtesans, lawyers, and colonial officials. The art is a living newspaper as much as a religious art. Talapatra is exclusively mythological and cosmological: the ten avatars of Vishnu (Dashavatara), episodes from the Ramayana and Mahabharata, the divine stories of Jagannath and Krishna, and sacred architectural plans of temples. Contemporary secular subjects almost never appear in traditional Talapatra."
      },
      {
        category: "Difficulty & Accessibility",
        text: "Kalighat is technically accessible in concept (a few brush types, a small colour palette, simple compositions) but brutally demanding in execution — the fluid contour strokes are nearly impossible to fake and require lifelong practice. Talapatra demands a completely different kind of discipline: the patience to etch thousands of tiny lines with an iron stylus, the iconographic knowledge to render deities according to canonical conventions (correct mudras, attributes, proportions), and the prior preparation skills to treat and mount the palm leaf canvas. Both are demanding traditions, but in different dimensions of skill."
      }
    ]
  },

  "kalighat__warli": {
    cards: [
      {
        category: "Visual Style & Composition",
        text: "Kalighat and Warli both use minimalist compositions, but their minimalism means entirely different things. Kalighat's minimal aesthetic comes from deliberate elimination — the Patua artists stripped away centuries of folk-painting density to create bold, solitary figures for an urban market. Warli's minimal aesthetic comes from an additive grammar of pure geometry — circles, triangles, squares combined into densely packed scenes. A Kalighat composition is typically one dominant figure; a Warli composition is typically dozens of tiny figures engaged in collective activity. Both look simple, but one reads as a portrait, the other as a map."
      },
      {
        category: "Colour Palette",
        text: "Kalighat uses bright, transparent watercolour washes — multiple colours applied over black outlines on white paper. Warli uses a single colour: white. The entire visual world of a traditional Warli painting is expressed in white rice paste on a dark red-brown background. This is one of the most severe colour restrictions of any major folk art tradition in India. The constraint forces all meaning into the quality and arrangement of white marks — not into colour variation. Kalighat, by contrast, uses colour expressively to differentiate garments, skin tones, and decorative elements."
      },
      {
        category: "Brushwork & Line Quality",
        text: "Kalighat's line is gestural and calligraphic — the hallmark sweeping contour stroke requires a loaded brush and total confidence in a single fluid motion. The line swells and tapers, conveying both form and emotion simultaneously. Warli's line is thin, even, and geometric — drawn with a chewed bamboo stick dipped in rice paste. Rather than gesture, Warli values repetition and rhythm: the same triangle or circle repeated hundreds of times across a composition, each instance slightly hand-varied, creates a breathing, living surface."
      },
      {
        category: "Materials & Medium",
        text: "Kalighat is paper-based, using squirrel-hair brushes and watercolour or natural pigment washes. Warli is traditionally wall-based: the surface is a mud-and-cow-dung-plastered wall coated with red geru earth, painted with rice-paste white using chewed bamboo sticks. Both traditions have moved onto paper and canvas for commercial purposes, but the translation affects Warli more deeply — the warm texture of a mud wall, which the white paste sits on with a slightly raised, irregular quality, is lost on smooth paper."
      },
      {
        category: "Cultural & Regional Origin",
        text: "Kalighat is the art of the Bengali urban Patua community — responding to colonialism, urbanisation, and the creation of a modern Indian mass culture in 19th-century Calcutta. It reflects a moment of cultural collision and creative reinvention. Warli is among the most geographically isolated of India's folk traditions — created by the Warli tribe of Maharashtra's North Sahyadri hills, far from urban centres. It was largely unknown outside its community until the 1970s, and its content is focused entirely inward on tribal life, ritual, and nature."
      },
      {
        category: "Common Motifs & Subjects",
        text: "Kalighat depicts individually named, iconographically specific figures — Goddess Kali with her specific attributes, the 'babu' with his Western-inflected costume, the courtesan with her recognisable poses. Identity and social legibility are paramount. Warli depicts collective, anonymous figures: farmers, dancers, hunters — their faces featureless, their individuality irrelevant. The subject is always the group, the community, the cycle of seasons and rituals. A Kalighat painting tells you who a person is; a Warli painting tells you what a community does."
      },
      {
        category: "Difficulty & Accessibility",
        text: "Kalighat's contour-stroke technique is notoriously difficult — the most demanding aspect of the tradition — but the overall visual vocabulary (a few figures, simple compositions) makes it legible and appealing to beginners who want to attempt simplified versions. Warli is uniquely accessible as a starting point: the three geometric shapes (circle, triangle, square) and stick-figure conventions are immediately reproducible, making it one of the most popular folk art forms to introduce to children and newcomers. True compositional mastery, however — the ability to fill a wall with flowing, balanced, rhythmically complex scenes — takes years."
      }
    ]
  },

  "gond__sohrai": {
    cards: [
      {
        category: "Visual Style & Composition",
        text: "Both Gond and Sohrai are nature-centered traditions with deep roots in tribal reverence for animals and the forest. But their compositional logics are very different. Gond painting (particularly Jangarh Kalam) is densely patterned and figurative, with animals and trees filling a defined canvas space in a complex interlinked network. Sohrai is mural-scale and more open: large animal forms float across mud wall surfaces with space around them, their interiors filled with geometric X-ray patterns but surrounded by breathing room rather than interlocking complexity."
      },
      {
        category: "Colour Palette",
        text: "Gond's palette is vivid and chromatic — red, blue, yellow, orange, green — applied as flat, bold zones of saturated colour with black-line separation. Sohrai's palette is earthen and symbolically coded: red (geru, ancestor blood), black (manganese, Shiva and eternity), white (duddi matti, food), and yellow ochre — all raw earth pigments with ritual meanings. Gond colour is expressive and chosen for visual impact; Sohrai colour is prescribed by cosmological convention and carries meaning regardless of the artist's individual preference."
      },
      {
        category: "Brushwork & Line Quality",
        text: "Gond's lines are made with fine brushes — synthetic or natural hair — creating the precise dots, dashes, and hatching that fill the composition. The technique has a jeweller's precision, especially in Jangarh Kalam's densely worked areas. Sohrai has no brushes: artists use fingertips for broad washes, broken combs for sgraffito scratching, cloth swabs for solid areas, and chewed datoon twigs for fine lines. The marks are physically varied because the tools are physically varied — each technique leaves a different mark-quality on the same composition."
      },
      {
        category: "Materials & Medium",
        text: "Gond painting has successfully migrated to paper and canvas, where natural earth pigments have been largely replaced by poster colours and acrylics. This transition preserves the visual vocabulary while making the art portable and durable for gallery markets. Sohrai is fundamentally wall-based: the sgraffito technique requires a wet clay substrate that cannot be replicated on paper. Sohrai on paper exists and is commercially available, but it is a simplified, translated form — the relief texture and architectural scale of the original are irreplaceable."
      },
      {
        category: "Cultural & Regional Origin",
        text: "Gond painting comes from the Pardhan Gond community of Madhya Pradesh's forested hills — a sub-group who served as bards, musicians, and storytellers for the wider Gond community. The paintings encode Gond mythology and the spiritual ecology of central India's forests. Sohrai comes from the Santhal, Munda, Oraon, Kurmi, and Agaria tribes of Jharkhand's Hazaribagh region — practiced exclusively by women as a matriarchal tradition linked to the Sohrai harvest festival and the worship of Pashupati, lord of animals. Both traditions are animistic, but Gond is more mythological in orientation, Sohrai more ritual-calendrical."
      },
      {
        category: "Common Motifs & Subjects",
        text: "Gond and Sohrai share a deep preoccupation with animals, but depict them differently. In Gond, animals (peacocks, tigers, fish, snakes) are spiritual protagonists — each one inhabited by a dev (spirit) — rendered with dense patterned textures that celebrate the complexity of their inner nature. In Sohrai, cattle are the sacred focus — depicted with X-ray interiors that make their internal essence visible — surrounded by wild animals, birds, and fertility motifs. Gond animals are cosmological; Sohrai animals are ritual participants in the harvest ceremony."
      },
      {
        category: "Difficulty & Accessibility",
        text: "Gond painting's dot-and-dash technique is progressively learnable — beginners can start with simple outlines and basic fills, and add complexity gradually. The transition to paper makes it particularly accessible for contemporary learners. Sohrai is culturally gated in its traditional form — the ritual timing (post-monsoon, pre-harvest), the specific earth pigments, the mud-wall substrate, and the community knowledge of which motifs belong to which community are all barriers to outsiders. On paper, simplified Sohrai motifs can be learned, but the full tradition is most meaningfully experienced within its original cultural context."
      }
    ]
  },

  "gond__talapatra": {
    cards: [
      {
        category: "Visual Style & Composition",
        text: "Gond painting is organic and expansive — forms grow into each other, boundaries between figure and ground dissolve, and the composition radiates from no single fixed centre. Talapatra Chitra is architecturally structured: a hierarchical, symmetrical layout with a central deity flanked by attendants, enclosed within concentric ornamental borders, with every element assigned a canonical position according to temple iconographic conventions. Gond is improvisational and responsive to the artist's vision; Talapatra is inherited and prescribed."
      },
      {
        category: "Colour Palette",
        text: "Gond painting uses bold, saturated colour zones — red, blue, yellow, orange — that create high visual energy. Talapatra Chitra in its traditional palm-leaf form is essentially monochrome: black engraved lines against the golden-tan of the natural leaf, with occasional natural pigment highlights (turmeric yellow, geru red, lamp-black). The contrast between Gond's chromatic abundance and Talapatra's tonal restraint reflects a fundamental difference in purpose: Gond paint celebrates the vitality of the natural world, Talapatra's measured line serves the precision of sacred narrative."
      },
      {
        category: "Brushwork & Line Quality",
        text: "Gond's mark-making is diverse — dots, dashes, comb lines, cross-hatching — built up slowly into dense textured surfaces. The process is additive and patient. Talapatra's mark is singular: the incised line of the iron stylus, uniform in width, varying only in length and direction. There is no equivalent of Gond's textural vocabulary in Talapatra — the tool forces a different kind of economy, where every line must count for both its descriptive and its decorative function simultaneously."
      },
      {
        category: "Materials & Medium",
        text: "Contemporary Gond painting works primarily on paper and canvas with synthetic pigments — portable, durable, and gallery-ready. Talapatra Chitra is inseparable from its unique medium: the prepared palm leaf, treated with boiling, turmeric, and sun-drying over months. The leaf's natural golden surface, its slight translucency, and its resistance to the stylus point all contribute irreplaceable qualities that no substitute medium can replicate. A Talapatra painting on paper is a teaching exercise; a Talapatra on actual palm leaf is a sacred object."
      },
      {
        category: "Cultural & Regional Origin",
        text: "Gond art comes from the tribal Pardhan communities of central India's Gondwana region — connected to oral traditions, bardic performance, and animistic nature worship. It entered the gallery world only in the 1980s when Jangarh Singh Shyam was discovered by Bharat Bhavan Museum. Talapatra Chitra belongs to the hereditary Chitrakara families of coastal Odisha — specifically connected to the Jagannath temple system, one of India's most ancient and continuously active pilgrimage centres. The two traditions represent opposite poles of Indian folk art: one rooted in the forest and animism, the other in temple architecture and devotional Hinduism."
      },
      {
        category: "Common Motifs & Subjects",
        text: "Gond art is dominated by the natural world — trees, animals, birds, fish — each carrying spiritual significance as a vessel for a forest spirit (dev). The iconography is invented and evolving; no canonical texts constrain what a peacock or tiger must look like. Talapatra's subjects are almost exclusively mythological and theological: Vishnu's ten avatars, episodes from the Mahabharata and Ramayana, Krishna's divine plays, and the sacred rituals of the Jagannath temple. Every figure must conform to a received iconographic tradition. In Gond, the artist interprets nature; in Talapatra, the artist transmits tradition."
      },
      {
        category: "Difficulty & Accessibility",
        text: "Gond painting is among the most accessible major folk art forms: beginners can achieve satisfying results using simple outlines and basic dot-and-dash fills, progressing towards more complex textures as confidence grows. Paper and common paints are sufficient. Talapatra demands mastery on two separate axes simultaneously: the physical skill of engraving with a stylus (difficult, irreversible, demanding precise pressure control) and the iconographic knowledge to render deities and mythological scenes correctly. Without access to a hereditary teacher from a Chitrakara family, learning Talapatra in its authentic form is almost impossible."
      }
    ]
  },

  "gond__warli": {
    cards: [
      {
        category: "Visual Style & Composition",
        text: "Gond and Warli are both non-representational in their approach to the natural world, but they achieve very different effects. Gond painting fills every inch of the canvas with densely textured, interlocking forms — animals and trees merge into a single breathing ecosystem. Warli uses geometry to create open, airy scenes: small triangular figures arranged in rhythmic groups across a broad background, with plenty of negative space between them. Gond is claustrophobic in the best sense — intense, overwhelming; Warli is spacious and communal, like watching a festival from a hillside."
      },
      {
        category: "Colour Palette",
        text: "Gond painting is celebrated for its chromatic boldness — vivid zones of red, yellow, blue, and orange, sharply divided by black outlines, create an electric visual energy. Warli uses a single colour: white on a dark red-ochre ground. This two-tone austerity is one of Warli's most striking features. Where Gond paints the forest as a place of colour and abundance, Warli renders the world in pure light-and-shadow — the white figures emerging from the earthy ground as if illuminated from within."
      },
      {
        category: "Brushwork & Line Quality",
        text: "Gond painting requires a fine brush and a patient, meditative approach — thousands of tiny dots and dashes accumulate to create richly textured interiors. Warli is drawn with a chewed bamboo stick: the mark is thin, scratchy, and slightly irregular, making each repetition of the triangle or circle slightly different from the last. Gond's quality is in its density and precision; Warli's is in its rhythm and vitality. Both traditions are built on repetition, but Gond repeats marks to build texture, while Warli repeats forms to build narrative."
      },
      {
        category: "Materials & Medium",
        text: "Gond painting has comfortably transitioned to paper and canvas with poster or acrylic colours, making it accessible and gallery-viable without major loss to its visual vocabulary. Warli's traditional medium is the mud wall — a red-ochre-and-cow-dung-plastered surface on which white rice paste is applied. On paper, Warli retains its visual character (the white-on-ochre contrast survives any substrate), making it one of the folk traditions that translates best to portable formats. Both arts are now widely practiced on commercial paper."
      },
      {
        category: "Cultural & Regional Origin",
        text: "Gond art comes from the Pardhan Gond community of Madhya Pradesh's forested Gondwana plateau — a bard community whose paintings encode tribal mythology and animistic spirituality. It entered wider public awareness only in the 1980s. Warli art comes from the Warli tribe of Maharashtra's Sahyadri foothills — near the coasts north of Mumbai — and was brought to national attention in the 1970s through the work of Jivya Soma Mashe. Both are tribal traditions that were unknown to mainstream India until the late 20th century; both have since become internationally recognised. Their geographical proximity (both from central-western India) belies how different their visual languages are."
      },
      {
        category: "Common Motifs & Subjects",
        text: "Gond painting centres on the forest ecosystem — peacocks, tigers, fish, snakes, and the great Mahua tree — each form inhabited by a spirit (dev) and depicted with intricate textural patterning that honours its inner complexity. Warli painting centres on human community — the tarpa dance, wedding ceremonies, harvest rituals, hunting and farming scenes — with nature appearing as a backdrop rather than a protagonist. In Gond, the forest is the subject; in Warli, human beings living in harmony with nature are the subject. Together they represent two different ways that tribal art can honour the relationship between people and the natural world."
      },
      {
        category: "Difficulty & Accessibility",
        text: "Gond's dot-and-dash technique is learnable progressively — beginners can start with simple outlines and add textural complexity over time, making it well-suited for step-by-step instruction. Warli is one of the most instantly accessible folk art forms in India: the three shapes (circle, triangle, square) and stick figures are immediately reproducible by almost anyone, making it enormously popular for art education and craft workshops. Both traditions reward deeper study, but Warli has the lower barrier to entry — a child can make a recognisable Warli scene in ten minutes."
      }
    ]
  },

  "sohrai__talapatra": {
    cards: [
      {
        category: "Visual Style & Composition",
        text: "Sohrai and Talapatra Chitra are among the most visually distinct of all Indian folk art forms when placed side by side. Sohrai is mural-scale, earthen, and fluid: large animal forms fill the walls of mud houses in sweeping compositions that emerge organically from the raw material. Talapatra is miniature-scale, linear, and architecturally precise: figures are arranged in strict hierarchical rows within concentric border frames on the surface of a palm leaf no wider than a hand. One is the art of mud walls and monsoon rhythms; the other is the art of the sacred manuscript and temple canon."
      },
      {
        category: "Colour Palette",
        text: "Sohrai's palette is prescribed by the earth: red geru (ancestor blood), black manganese (Shiva's eternity), white duddi clay (food and purity), and yellow ochre. These pigments are collected from specific locations near the village and carry cosmological meaning that is independent of aesthetic preference. Talapatra is fundamentally monochrome — black soot rubbed into engraved grooves on golden-tan palm leaf — with natural pigment colour added sparingly for key ornamental details. Both palettes are constrained by their materials, but for different reasons: Sohrai by ritual prescription, Talapatra by the physical nature of the engraving medium."
      },
      {
        category: "Brushwork & Line Quality",
        text: "Sohrai uses no brushes — artists work with fingers, broken combs, cloth swabs, and twigs to create marks that range from broad gestural washes to delicate sgraffito textures scratched through wet clay. The marks are intimate, physical, and direct. Talapatra uses an iron stylus to etch lines into the hard surface of a dried palm leaf — a completely different relationship between tool and ground. The stylus requires focused, controlled pressure; the marks are precise and permanent. Sohrai marks are laid on; Talapatra marks are cut in."
      },
      {
        category: "Materials & Medium",
        text: "Sohrai is inseparable from the mud wall of a tribal home — the medium is literally the artist's home, replastered each year after the monsoon and repainted for the Sohrai festival. Talapatra is inseparable from the palm leaf pothi — a manuscript format whose preparation takes months and whose durability has allowed Odishan palm-leaf paintings to survive for centuries. Both traditions are completely defined by their unique substrates; neither translates fully to paper or canvas. In both cases, the 'canvas' is also a sacred object before the first mark is made."
      },
      {
        category: "Cultural & Regional Origin",
        text: "Sohrai is the harvest festival art of tribal communities (Santhal, Munda, Oraon, Kurmi, Agaria) in Jharkhand's Hazaribagh district — practiced exclusively by women, tied to the agricultural calendar, and focused on the worship of Pashupati (lord of animals) and cattle. Talapatra Chitra originates in the Chitrakara hereditary artist families of coastal Odisha — men who have served the Jagannath temple system for centuries, creating devotional paintings of deities according to strict canonical conventions. One tradition is matriarchal, agricultural, and animistic; the other is patriarchal, priestly, and devotional."
      },
      {
        category: "Common Motifs & Subjects",
        text: "Sohrai's subjects are drawn from the natural world as experienced by a farming community: cattle (especially the humped zebu cow, the sacred animal of the festival), wild animals, birds, lotus flowers, and trees — particularly the Kamalban lotus forest motif. No mythological figures appear; the world is the harvest landscape seen through the eyes of women who live in it. Talapatra is exclusively mythological: Vishnu's ten avatars, Jagannath and his siblings, scenes from the Mahabharata and Ramayana. The natural world appears only as an attribute or backdrop for divine figures."
      },
      {
        category: "Difficulty & Accessibility",
        text: "Sohrai is culturally bounded but technically approachable within its community — children learn by watching mothers and grandmothers, progressing from simple fingerprint patterns to complex sgraffito work over many festival cycles. For outsiders, the authentic form is nearly inaccessible without the earth pigments, the mud wall, and the community knowledge. Talapatra is equally bounded by cultural context, but additionally demanding on a technical level: the iron stylus on palm leaf requires practised pressure control that cannot be rushed, and the iconographic conventions for depicting deities must be memorised before a single mark is made."
      }
    ]
  },

  "sohrai__warli": {
    cards: [
      {
        category: "Visual Style & Composition",
        text: "Both Sohrai and Warli are mural traditions painted on the walls of tribal homes, but their compositional approaches are entirely different. Sohrai covers wall surfaces with large, fluid animal forms — each animal a solitary protagonist given room to breathe, its interior filled with X-ray patterns, the spaces between animals filled with floral and geometric motifs. Warli organises the wall around a central chauk (sacred square) and radiates outward with scenes of communal life — dozens of tiny geometric figures, all roughly equal in size, creating a democratic, all-over pattern."
      },
      {
        category: "Colour Palette",
        text: "Sohrai's palette is multi-toned and symbolically prescribed: red ancestor-earth, black Shiva-manganese, white food-clay, and yellow ochre — four colours, each with a cosmological meaning fixed by tradition. Warli uses a single colour: white rice paste on a red-ochre-and-cow-dung background. The severe two-tone restriction is Warli's most recognisable feature. Sohrai, with its four symbolic earth pigments, feels richer and more varied by comparison — even though both traditions are working within tight, prescribed colour vocabularies."
      },
      {
        category: "Brushwork & Line Quality",
        text: "Sohrai's mark-making is physically diverse — fingers for washes, combs for sgraffito, swabs for large fields, twigs for lines — each leaving a different textural signature. The sgraffito technique (scratching white through black) is unique to Sohrai and has no equivalent in any other Indian folk tradition. Warli's mark is made with a chewed bamboo stick — thin, consistent, slightly fuzzy at the edges from the fibrous tip. The Warli line is about repetition and rhythm; the Sohrai mark is about material variety and texture."
      },
      {
        category: "Materials & Medium",
        text: "Both traditions are wall-based and use naturally sourced pigments. Sohrai uses earth pigments — geru, manganese, duddi clay — collected from specific local sites and applied to freshly plastered mud walls while wet, enabling the sgraffito technique. Warli uses red geru mixed with cow dung as the base coat, then applies white rice paste on top. The materials are different but both are entirely natural, locally sourced, and deeply connected to the agricultural landscape of the communities that use them."
      },
      {
        category: "Cultural & Regional Origin",
        text: "Sohrai is practiced in Jharkhand's Hazaribagh region by women of multiple tribal communities (Santhal, Munda, Oraon, Kurmi, Agaria) for the Sohrai harvest festival in November. The ritual is tied to the worship of Pashupati and the blessing of cattle. Warli is practiced in the North Sahyadri hills of Maharashtra by the Warli tribe, primarily for weddings (the Lagnachauk painting) and the worship of Palghat Devi (the mother goddess of fertility). Both are women's traditions tied to annual rituals, but the rituals themselves — harvest in Sohrai, marriage and fertility in Warli — are different."
      },
      {
        category: "Common Motifs & Subjects",
        text: "Sohrai's dominant motif is the animal — particularly cattle, but also tigers, deer, and birds — depicted with X-ray interiors that reveal the animal's inner spiritual essence. The lotus (Kamalban) is the most complex floral motif. Warli's dominant motif is the human community — dancers, farmers, hunters, wedding processions — depicted as anonymous geometric figures in collective activity. Animals appear in Warli but as supporting characters rather than protagonists. One tradition venerates the animal world; the other celebrates human society."
      },
      {
        category: "Difficulty & Accessibility",
        text: "Sohrai in its full, traditional form — earth pigments, mud walls, sgraffito technique, community-specific motif conventions — is among the most difficult folk traditions to access as an outsider. Even simplified Sohrai on paper requires understanding which techniques to use and which motifs belong to which tribal community. Warli, by contrast, is one of the most accessible folk art forms anywhere: the geometric vocabulary (three shapes, stick figures) is immediately understandable and reproducible, making it enormously popular for educational contexts. Both traditions have been adapted to paper and canvas, but Warli's simplicity makes it far more approachable for learners."
      }
    ]
  },

  "talapatra__warli": {
    cards: [
      {
        category: "Visual Style & Composition",
        text: "Talapatra Chitra and Warli painting are perhaps the most contrasting pair in all of Indian folk art — one is miniature, the other is mural; one is linear and engraved, the other is painted; one is densely figurative, the other is abstractly geometric. Talapatra organises its tiny palm-leaf surface into hierarchical rows of elaborately detailed figures within multi-layered ornamental borders. Warli covers entire walls with simple geometric shapes arranged in communal, circular, all-over patterns. Looking at them together reveals the full range of what 'traditional Indian art' can mean."
      },
      {
        category: "Colour Palette",
        text: "Talapatra Chitra in its purest form is monochrome: black lines on a golden-tan palm leaf, with natural pigment colour added selectively for garments and ornaments. The palette is constrained by the medium — the palm leaf's own colour is the background, and the only marks are those cut into it. Warli uses two tones: white on dark red-ochre. The background is actively painted (the mud wall must be coated with geru), and the white rice-paste figures sit on it with a slight physical relief. Both traditions are highly restricted in colour; both make this restriction a virtue."
      },
      {
        category: "Brushwork & Line Quality",
        text: "Talapatra's marks are made with an iron stylus pressed into a hard palm-leaf surface — the line is incised, not painted, and has a mechanical precision that no brush can match. Every curve must be planned; spontaneity is physically impossible. Warli's marks are made with a chewed bamboo stick dipped in rice paste — the line is painted, slightly trembling, and alive with hand movement. The two tools could not be more different: one cuts, the other deposits; one requires stillness, the other requires gesture."
      },
      {
        category: "Materials & Medium",
        text: "Talapatra Chitra's medium — the prepared palm leaf — is among the most ritually significant and technically demanding in Indian art. Months of preparation result in a surface that is both archival (surviving centuries) and delicate (cracking if mishandled). Warli's medium — a mud wall coated with earth pigment — is ephemeral by design: it weathers, crumbles, and is replastered for the next ritual cycle. This contrast in durability reflects a fundamental difference in purpose: Talapatra preserves sacred knowledge across generations; Warli marks the living rhythm of the seasons."
      },
      {
        category: "Cultural & Regional Origin",
        text: "Talapatra Chitra is rooted in the hereditary Chitrakara families of coastal Odisha — men who have served the Jagannath temple system for over a millennium, creating paintings that stand in for deities during ritual observances. The tradition is patriarchal, priestly, and deeply textual (inseparable from the palm-leaf manuscript culture of Odishan Hinduism). Warli painting is a women's tradition of the Warli tribe of Maharashtra's Sahyadri hills — communal, animistic, and connected to the agricultural and life-cycle rituals of the tribe. One tradition serves a major Hindu temple; the other serves a tribal community's relationship with nature and fertility."
      },
      {
        category: "Common Motifs & Subjects",
        text: "Talapatra's entire subject world is mythological: Vishnu's avatars, Jagannath and his divine siblings, epic scenes from the Ramayana and Mahabharata. Every depicted figure carries specific iconographic attributes (conch shell, chakra, lotus, bow) that identify them within a complex theological system. Warli's subject world is this-worldly: the tarpa dance, the wedding procession, the harvest, the hunt, the village at night. No deities appear in their canonical forms — the central sacred image (the Devchauk) is a geometric abstraction of Palghat Devi rather than a portrait. One tradition serves devotional Hinduism; the other serves tribal cosmology."
      },
      {
        category: "Difficulty & Accessibility",
        text: "Talapatra is one of the most technically and culturally demanding folk art forms in India: the iron stylus technique requires years to master, the iconographic conventions for each deity must be memorised from hereditary masters, and the palm-leaf preparation process is a craft in itself. Warli is one of the most accessible: three geometric shapes and a stick figure are enough to begin, and the visual language is immediately legible to anyone. This contrast is not a value judgment — both traditions are deep and complex — but it reflects their very different social contexts: Talapatra is an art of hereditary specialists; Warli is a community art practiced by all."
      }
    ]
  }

};

/* Build a lookup that handles both key orders */
const COMPARISONS = {};
Object.keys(_COMPARISONS_RAW).forEach(key => {
  COMPARISONS[key] = _COMPARISONS_RAW[key];
  const [a, b] = key.split('__');
  const reverse = `${b}__${a}`;
  if (!COMPARISONS[reverse]) {
    COMPARISONS[reverse] = _COMPARISONS_RAW[key];
  }
});

/* ── Module internals ────────────────────────────────────────────────────── */

  let _leftId  = null;  // tutorial ID of the "Your Art" panel
  let _rightId = null;  // tutorial ID of the "Compare With" panel

  /* ── helpers ─────────────────────────────────────────────────────────── */

  function _lookupKey(compKey) {
    return COMPARISONS[compKey] || null;
  }

  function _pairKey(a, b) {
    return [a, b].sort().join('__');
  }

  /* ── public API ──────────────────────────────────────────────────────── */

  function start(artKey) {
    // Resolve classifier key → tutorial ID
    const tutorialId = ARTFORM_TO_TUTORIAL[artKey];

    if (!tutorialId) {
      // Unimplemented art form — fall back to Level 3 selection screen
      if (typeof Level3v2 !== 'undefined') {
        Level3v2.start(artKey, null);
      }
      return;
    }

    _leftId  = tutorialId;
    _rightId = null;

    // Populate left panel
    const leftPanel = document.getElementById('l4-left-panel');
    document.getElementById('l4-left-artname').textContent = ART_DISPLAY_NAMES[tutorialId] || artKey;
    renderPanel(leftPanel.querySelector('.l4-painting-wrap'), tutorialId);

    // Populate pill selector (all except current)
    _renderPills(tutorialId);

    // Reset right panel to placeholder
    _resetRightPanel();

    // Hide comparison section
    const compareSection = document.getElementById('l4-compare-section');
    compareSection.style.display = 'none';
    compareSection.innerHTML = '';

    // Show the screen (uses the global showScreen defined in app.js)
    showScreen('screen-l4');
    document.getElementById('screen-l4').scrollTop = 0;
  }

  function goBack() {
    showScreen('screen-level2');
  }

  function renderPanel(wrapEl, artformId) {
    const annotations = ANNOTATIONS[artformId];
    if (!annotations) {
      wrapEl.innerHTML = '<p style="padding:16px;font-family:Hind,sans-serif;color:#B94012">No annotation data available.</p>';
      return;
    }

    // Build image URL
    const imgUrl = `/level3v2/step_images/${artformId}/reference.png`;

    wrapEl.innerHTML = `<img src="${imgUrl}" alt="${ART_DISPLAY_NAMES[artformId] || artformId} reference painting" />`;

    // Add annotation boxes
    annotations.forEach(ann => {
      const box = document.createElement('div');
      box.className = 'l4-annotation-box';
      box.setAttribute('role', 'button');
      box.setAttribute('tabindex', '0');
      box.setAttribute('aria-label', ann.title);
      box.style.top    = ann.top;
      box.style.left   = ann.left;
      box.style.width  = ann.width;
      box.style.height = ann.height;

      const labelEl = document.createElement('span');
      labelEl.className = 'l4-ann-label';
      labelEl.textContent = ann.label;
      box.appendChild(labelEl);

      box.addEventListener('click', () => openAnnotation(ann.title, ann.body));
      box.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openAnnotation(ann.title, ann.body);
        }
      });

      wrapEl.appendChild(box);
    });
  }

  function selectCompare(artformId) {
    _rightId = artformId;

    // Update pill selection
    document.querySelectorAll('.l4-pill').forEach(p => {
      p.classList.toggle('selected', p.dataset.id === artformId);
    });

    // Render right panel painting
    document.getElementById('l4-right-artname').textContent = ART_DISPLAY_NAMES[artformId] || artformId;
    const rightWrap = document.getElementById('l4-right-panel').querySelector('.l4-painting-wrap');
    renderPanel(rightWrap, artformId);

    // Render comparison section
    _renderComparisons(_leftId, artformId);
  }

  function openAnnotation(title, body) {
    document.getElementById('l4-annotation-title').textContent = title;
    document.getElementById('l4-annotation-body').textContent  = body;

    const overlay = document.getElementById('l4-annotation-overlay');
    const sheet   = document.getElementById('l4-annotation-sheet');
    overlay.style.display = 'flex';

    // Trigger slide-up on next frame
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        sheet.classList.add('open');
      });
    });
  }

  function closeAnnotation() {
    const sheet   = document.getElementById('l4-annotation-sheet');
    const overlay = document.getElementById('l4-annotation-overlay');
    sheet.classList.remove('open');
    sheet.addEventListener('transitionend', () => {
      overlay.style.display = 'none';
    }, { once: true });
  }

  /* ── private helpers ─────────────────────────────────────────────────── */

  function _renderPills(excludeId) {
    const row = document.getElementById('l4-pill-row');
    row.innerHTML = '';

    Object.keys(ART_DISPLAY_NAMES).forEach(id => {
      if (id === excludeId) return;
      const btn = document.createElement('button');
      btn.className = 'l4-pill';
      btn.dataset.id = id;
      btn.textContent = ART_DISPLAY_NAMES[id];
      btn.addEventListener('click', () => selectCompare(id));
      row.appendChild(btn);
    });
  }

  function _resetRightPanel() {
    document.getElementById('l4-right-artname').textContent = '';

    const rightWrap = document.getElementById('l4-right-panel').querySelector('.l4-painting-wrap');
    rightWrap.innerHTML = `
      <div class="l4-placeholder">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 36 L16 20 L24 28 L32 16 L40 36 Z" stroke="#C98A1A" stroke-width="2" fill="none" stroke-linejoin="round"/>
          <circle cx="34" cy="14" r="3" fill="#C98A1A"/>
          <rect x="6" y="6" width="36" height="36" rx="4" stroke="#C98A1A" stroke-width="2" fill="none"/>
          <path d="M6 32 Q12 28 18 32 Q24 36 30 32 Q36 28 42 32" stroke="#C98A1A" stroke-width="1.5" fill="none"/>
        </svg>
        <p class="l4-placeholder-text">Select an art form above to begin comparing</p>
      </div>`;
  }

  function _renderComparisons(leftId, rightId) {
    const section = document.getElementById('l4-compare-section');
    const key = _pairKey(leftId, rightId);
    const data = _lookupKey(key);

    if (!data) {
      section.style.display = 'none';
      return;
    }

    const leftName  = ART_DISPLAY_NAMES[leftId]  || leftId;
    const rightName = ART_DISPLAY_NAMES[rightId] || rightId;

    section.style.display = 'block';
    section.innerHTML = `
      <h2 class="l4-compare-title">How They Compare</h2>
      <p style="font-family:'Hind',sans-serif;font-size:0.82rem;color:#7a5c3a;margin:0 0 4px;">
        ${leftName} &nbsp;↔&nbsp; ${rightName}
      </p>
      <div class="l4-cards-list" id="l4-cards-list"></div>`;

    const list = document.getElementById('l4-cards-list');
    data.cards.forEach((card, i) => {
      const el = document.createElement('div');
      el.className = 'l4-compare-card';
      el.style.animationDelay = `${i * 80}ms`;
      el.innerHTML = `
        <p class="l4-compare-card-category">${card.category}</p>
        <p class="l4-compare-card-text">${card.text}</p>`;
      list.appendChild(el);
    });

    // Scroll comparison section into view after animation starts
    setTimeout(() => {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }

  return { start, goBack, renderPanel, selectCompare, openAnnotation, closeAnnotation };

})();

/* ── Wire up modal close button ───────────────────────────────────────────── */

const closeBtn = document.getElementById('l4-annotation-close');
if (closeBtn) closeBtn.addEventListener('click', () => Level4.closeAnnotation());

const overlay = document.getElementById('l4-annotation-overlay');
if (overlay) {
  overlay.addEventListener('click', e => {
    if (e.target === overlay) Level4.closeAnnotation();
  });
}
