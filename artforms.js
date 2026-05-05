/**
 * artforms.js — Chitra Katha art form data
 * Keys match EXACTLY what the Teachable Machine classifier returns
 * (after .trim() is applied in app.js — trailing spaces are stripped).
 *
 * Note: 'Sanji Art  of Uttar Pradesh' has a genuine double-space in the
 * model's label — kept here to match.
 *
 * Fields: name, region, coords, tagline, tools, surface, colours,
 *         significance, translations { hi, bn, ta, gu, mr }
 * Each translation has: tagline (translated), plus significance/tools/
 * surface/colours (empty stubs — fall back to English when blank).
 */

const ARTFORMS = {

  "Gond Art of Madhya Pradesh": {
    name: "Gond Art",
    region: "Madhya Pradesh (Mandla, Dindori)",
    coords: [22.5, 80.5],
    tagline: "The pulse of the forest in every line",
    tools: "Fine-tipped brushes, pens, or even fingers for linear designs.",
    surface: "Walls, floors, or handmade paper and canvas.",
    colours: "Natural pigments from charcoal, colored soil, and plant sap.",
    significance: "Uses dots and lines to create a sense of movement. Themes revolve around nature and the belief that 'viewing a good image brings good luck.'",
    translations: {
      hi: { tagline: "हर रेखा में जंगल की धड़कन", significance: "", tools: "", surface: "", colours: "" },
      bn: { tagline: "প্রতিটি রেখায় অরণ্যের স্পন্দন", significance: "", tools: "", surface: "", colours: "" },
      ta: { tagline: "ஒவ்வொரு கோட்டிலும் காட்டின் துடிப்பு", significance: "", tools: "", surface: "", colours: "" },
      gu: { tagline: "", significance: "", tools: "", surface: "", colours: "" },
      mr: { tagline: "प्रत्येक रेषेत जंगलाची स्पंदने", significance: "", tools: "", surface: "", colours: "" }
    }
  },

  "Kalighat of Bengal": {
    name: "Kalighat Painting",
    region: "Kolkata, West Bengal",
    coords: [22.52, 88.36],
    tagline: "Sacred devotion meets sharp social wit",
    tools: "Squirrel hair or goat hair brushes.",
    surface: "Mill-made paper.",
    colours: "Water-based pigments; often features silver or tin for jewelry.",
    significance: "Originated near Kalighat Temple. Known for broad, sweeping brushstrokes and satirical depictions of daily life/social changes.",
    translations: {
      hi: { tagline: "पवित्र भक्ति और तीखी सामाजिक व्यंग्य का संगम", significance: "", tools: "", surface: "", colours: "" },
      bn: { tagline: "পবিত্র ভক্তি মেলে তীক্ষ্ণ সামাজিক ব্যঙ্গের সাথে", significance: "", tools: "", surface: "", colours: "" },
      ta: { tagline: "புனித பக்தியும் கூர்மையான சமூக நகைச்சுவையும்", significance: "", tools: "", surface: "", colours: "" },
      gu: { tagline: "", significance: "", tools: "", surface: "", colours: "" },
      mr: { tagline: "पवित्र भक्ती आणि तीव्र सामाजिक व्यंग्य", significance: "", tools: "", surface: "", colours: "" }
    }
  },

  "Soharai of Jharkhand": {
    name: "Sohrai Painting",
    region: "Hazaribagh, Jharkhand",
    coords: [24.0, 85.3],
    tagline: "A harvest celebration painted on living walls",
    tools: "Chewed twigs, cloth rags, or fingers.",
    surface: "Mud walls of houses.",
    colours: "Different colored clays (Red, Black, Yellow, White).",
    significance: "A ritualistic harvest art practiced by women. It celebrates fertility and nature, typically painted after the monsoon.",
    translations: {
      hi: { tagline: "जीवित दीवारों पर चित्रित फसल उत्सव", significance: "", tools: "", surface: "", colours: "" },
      bn: { tagline: "জীবন্ত দেওয়ালে আঁকা ফসল উৎসব", significance: "", tools: "", surface: "", colours: "" },
      ta: { tagline: "உயிரோட்டமான சுவர்களில் வரையப்பட்ட அறுவடை கொண்டாட்டம்", significance: "", tools: "", surface: "", colours: "" },
      gu: { tagline: "", significance: "", tools: "", surface: "", colours: "" },
      mr: { tagline: "जिवंत भिंतींवर रेखाटलेला कापणी उत्सव", significance: "", tools: "", surface: "", colours: "" }
    }
  },

  "Tanjore Painting of Tamil Nadu": {
    name: "Tanjore Painting",
    region: "Thanjavur, Tamil Nadu",
    coords: [10.78, 79.13],
    tagline: "Devotion rendered in gold and gemstone",
    tools: "Brushes; wooden planks (Palagai Padam).",
    surface: "Wooden planks coated with lime/chalk and gum.",
    colours: "Vivid mineral colors, precious stones, and thick gold foil.",
    significance: "High-relief (3D) effect. Primarily depicts deities (like infant Krishna) with round faces and large eyes.",
    translations: {
      hi: { tagline: "सोने और रत्नपाषाण में ढली भक्ति", significance: "", tools: "", surface: "", colours: "" },
      bn: { tagline: "সোনা ও রত্নপাথরে গড়া ভক্তি", significance: "", tools: "", surface: "", colours: "" },
      ta: { tagline: "தங்கமும் மணிகளும் செய்யும் பக்தி", significance: "", tools: "", surface: "", colours: "" },
      gu: { tagline: "", significance: "", tools: "", surface: "", colours: "" },
      mr: { tagline: "सोने आणि रत्नांमध्ये रेखाटलेली भक्ती", significance: "", tools: "", surface: "", colours: "" }
    }
  },

  "Kalamkari Of Tamil Nadu": {
    name: "Kalamkari (Srikalahasti)",
    region: "Andhra Pradesh",
    coords: [14.5, 79.5],
    tagline: "A pen's journey through myth and cloth",
    tools: "Kalam (bamboo pen) with a felt/cloth tip.",
    surface: "Cotton cloth treated with milk and myrobalan.",
    colours: "Vegetable dyes; fermented jaggery and iron for black.",
    significance: "\"Kalam\" means pen, \"Kari\" means work. Features the Srikalahasti style (freehand drawing) and Masulipatnam style (block printing).",
    translations: {
      hi: { tagline: "कलम की यात्रा मिथक और वस्त्र के माध्यम से", significance: "", tools: "", surface: "", colours: "" },
      bn: { tagline: "কলমের পথে পৌরাণিক কাহিনি ও বস্ত্রের মধ্য দিয়ে", significance: "", tools: "", surface: "", colours: "" },
      ta: { tagline: "கடவுளின் கதையை துணியில் எழுதும் கலம்", significance: "", tools: "", surface: "", colours: "" },
      gu: { tagline: "", significance: "", tools: "", surface: "", colours: "" },
      mr: { tagline: "पौराणिक कथा आणि कापडातून कलमाचा प्रवास", significance: "", tools: "", surface: "", colours: "" }
    }
  },

  "Sanji Art  of Uttar Pradesh": {
    name: "Sanji Art",
    region: "Uttar Pradesh (Mathura)",
    coords: [27.5, 77.7],
    tagline: "Stencilled flowers as an offering to Krishna",
    tools: "Specialized fine scissors or stencils.",
    surface: "Floors, walls, or water surfaces.",
    colours: "Dry pigments (gulal) or flower petals.",
    significance: "Though it uses stencils, it is the art of hand-cutting to create intricate silhouettes of Krishna's life. It is often floated on water to create a painting.",
    translations: {
      hi: { tagline: "कृष्ण को समर्पित स्टेंसिल से बने फूल", significance: "", tools: "", surface: "", colours: "" },
      bn: { tagline: "কৃষ্ণের পূজায় স্টেনসিল-কাটা ফুল", significance: "", tools: "", surface: "", colours: "" },
      ta: { tagline: "கிருஷ்ணனுக்கு அர்ப்பணிக்கப்பட்ட ஸ்டென்சில் மலர்கள்", significance: "", tools: "", surface: "", colours: "" },
      gu: { tagline: "", significance: "", tools: "", surface: "", colours: "" },
      mr: { tagline: "कृष्णाला अर्पण केलेली स्टेन्सिलमधून साकारलेली फुले", significance: "", tools: "", surface: "", colours: "" }
    }
  },

  "Warli oh Maharashtra": {
    name: "Warli Painting",
    region: "Thane/Nasik, Maharashtra",
    coords: [19.9, 72.8],
    tagline: "The geometry of community life",
    tools: "Bamboo sticks chewed at the end to form a brush.",
    surface: "Mud walls of huts.",
    colours: "White paste made from ground rice and water with gum.",
    significance: "Tribal art using basic shapes (circle, triangle, square) to represent life. Circles represent the sun/moon; triangles represent trees/mountains.",
    translations: {
      hi: { tagline: "सामुदायिक जीवन की ज्यामिति", significance: "", tools: "", surface: "", colours: "" },
      bn: { tagline: "সামাজিক জীবনের জ্যামিতি", significance: "", tools: "", surface: "", colours: "" },
      ta: { tagline: "சமூக வாழ்வின் வடிவியல்", significance: "", tools: "", surface: "", colours: "" },
      gu: { tagline: "", significance: "", tools: "", surface: "", colours: "" },
      mr: { tagline: "सामाजिक जीवनाची भूमिती", significance: "", tools: "", surface: "", colours: "" }
    }
  },

  "Phad of Rajasthan": {
    name: "Phad Painting",
    region: "Bhilwara, Rajasthan",
    coords: [25.3, 74.6],
    tagline: "A portable temple that travels with its story",
    tools: "Brushes made from squirrel/camel hair.",
    surface: "Phad (long canvas/scroll made of hand-woven cloth).",
    colours: "Natural stone colours mixed with water and gum.",
    significance: "Portable folk deities' temples. Used by Bhopas (priest-singers) who travel and sing stories of Pabuji or Devnarayan.",
    translations: {
      hi: { tagline: "एक पोर्टेबल मंदिर जो अपनी कहानी के साथ यात्रा करता है", significance: "", tools: "", surface: "", colours: "" },
      bn: { tagline: "নিজের গল্পের সাথে ভ্রমণ করা একটি বহনযোগ্য মন্দির", significance: "", tools: "", surface: "", colours: "" },
      ta: { tagline: "தனது கதையுடன் பயணிக்கும் நடமாடும் கோயில்", significance: "", tools: "", surface: "", colours: "" },
      gu: { tagline: "", significance: "", tools: "", surface: "", colours: "" },
      mr: { tagline: "स्वतःच्या कथेसह प्रवास करणारे फिरते मंदिर", significance: "", tools: "", surface: "", colours: "" }
    }
  },

  "Pichhwai of Rajasthan": {
    name: "Pichhwai",
    region: "Nathdwara, Rajasthan",
    coords: [24.93, 73.82],
    tagline: "A living backdrop to the divine",
    tools: "Fine squirrel-hair brushes.",
    surface: "Hand-spun starched cloth.",
    colours: "Gold and silver leaf, stone pigments.",
    significance: "\"Pichh\" means back and \"wai\" means hanging. These are large paintings hung behind the idol of Shrinathji to depict different seasons and festivals.",
    translations: {
      hi: { tagline: "देवत्व की जीवंत पृष्ठभूमि", significance: "", tools: "", surface: "", colours: "" },
      bn: { tagline: "ঐশ্বরিক দৃশ্যের জীবন্ত পটভূমি", significance: "", tools: "", surface: "", colours: "" },
      ta: { tagline: "தெய்வீகத்திற்கு உயிரோட்டமான பின்னணி", significance: "", tools: "", surface: "", colours: "" },
      gu: { tagline: "", significance: "", tools: "", surface: "", colours: "" },
      mr: { tagline: "दैवी उपस्थितीची जिवंत पार्श्वभूमी", significance: "", tools: "", surface: "", colours: "" }
    }
  },

  "Madhubani of Bihar": {
    name: "Madhubani (Mithila Art)",
    region: "Mithila region, Bihar",
    coords: [26.37, 86.07],
    tagline: "The mythology of Mithila in every line",
    tools: "Twigs, matchsticks, fingers, and nib-pens.",
    surface: "Walls (Bhitti Chitra) and handmade paper.",
    colours: "Natural dyes from turmeric, indigo, flowers, and soot.",
    significance: "Traditionally done by women to mark births and marriages. Known for lack of empty space; gaps are filled with flowers and birds.",
    translations: {
      hi: { tagline: "हर रेखा में मिथिला की पौराणिक कथा", significance: "", tools: "", surface: "", colours: "" },
      bn: { tagline: "প্রতিটি রেখায় মিথিলার পৌরাণিক কাহিনি", significance: "", tools: "", surface: "", colours: "" },
      ta: { tagline: "ஒவ்வொரு கோட்டிலும் மிதிலையின் புராணக்கதை", significance: "", tools: "", surface: "", colours: "" },
      gu: { tagline: "", significance: "", tools: "", surface: "", colours: "" },
      mr: { tagline: "प्रत्येक रेषेत मिथिलेची पौराणिक कथा", significance: "", tools: "", surface: "", colours: "" }
    }
  },

  "Thangka Painting of Sikkim": {
    name: "Thangka Painting",
    region: "Lahaul, Spiti, & Sikkim",
    coords: [27.5, 88.5],
    tagline: "A scroll that opens a portal to enlightenment",
    tools: "Precision brushes.",
    surface: "Cotton or silk appliqué.",
    colours: "Mineral pigments (Gold, Lapis Lazuli, Malachite).",
    significance: "Buddhist scroll paintings used for meditation. Each detail — from the deity's posture to the landscape — has precise theological meaning.",
    translations: {
      hi: { tagline: "एक स्क्रॉल जो ज्ञान प्राप्ति के द्वार खोलता है", significance: "", tools: "", surface: "", colours: "" },
      bn: { tagline: "জ্ঞানালোকের দরজা খুলে দেওয়া একটি স্ক্রল", significance: "", tools: "", surface: "", colours: "" },
      ta: { tagline: "ஞானோதயத்திற்கான வாயிலை திறக்கும் சுருள்", significance: "", tools: "", surface: "", colours: "" },
      gu: { tagline: "", significance: "", tools: "", surface: "", colours: "" },
      mr: { tagline: "बोधप्राप्तीचे दालन उघडणारी एक गुंडाळी", significance: "", tools: "", surface: "", colours: "" }
    }
  },

  "Kolam of Tamil Nadu": {
    name: "Kolam Art",
    region: "Tamil Nadu",
    coords: [11.1, 78.7],
    tagline: "A daily prayer drawn at the threshold of dawn",
    tools: "Drawn by hand using fingers.",
    surface: "Ground/Threshold of houses.",
    colours: "Rice flour (dry or wet paste).",
    significance: "A daily morning ritual to welcome Lakshmi. Uses geometric grids of dots (Pulli) connected by loops or lines.",
    translations: {
      hi: { tagline: "भोर की दहलीज पर खींची जाने वाली दैनिक प्रार्थना", significance: "", tools: "", surface: "", colours: "" },
      bn: { tagline: "ভোরের দোরগোড়ায় আঁকা দৈনিক প্রার্থনা", significance: "", tools: "", surface: "", colours: "" },
      ta: { tagline: "விடியல் வாசலில் வரையப்படும் தினசரி வழிபாடு", significance: "", tools: "", surface: "", colours: "" },
      gu: { tagline: "", significance: "", tools: "", surface: "", colours: "" },
      mr: { tagline: "पहाटेच्या उंबरठ्यावर रेखाटलेली दैनिक प्रार्थना", significance: "", tools: "", surface: "", colours: "" }
    }
  },

  "Talpatra Chittar of Odisha": {
    name: "Talapatra Chitra",
    region: "Odisha",
    coords: [20.0, 85.8],
    tagline: "Stories engraved on leaves of time",
    tools: "An iron stylus (Lekhani) for engraving.",
    surface: "Dried palm leaves stitched together.",
    colours: "Natural soot (lampblack) and turmeric.",
    significance: "A form of Pattachitra where the image is etched into the leaf rather than painted. Black ink is rubbed over the etching to reveal the design.",
    translations: {
      hi: { tagline: "समय की पत्तियों पर उकेरी गई कहानियाँ", significance: "", tools: "", surface: "", colours: "" },
      bn: { tagline: "সময়ের পাতায় খোদাই করা গল্প", significance: "", tools: "", surface: "", colours: "" },
      ta: { tagline: "காலத்தின் இலைகளில் பொறிக்கப்பட்ட கதைகள்", significance: "", tools: "", surface: "", colours: "" },
      gu: { tagline: "", significance: "", tools: "", surface: "", colours: "" },
      mr: { tagline: "काळाच्या पानांवर कोरलेल्या कथा", significance: "", tools: "", surface: "", colours: "" }
    }
  },

  "Aipan Art of Uttrakhand": {
    name: "Aipan Art",
    region: "Uttarakhand (Kumaon)",
    coords: [29.6, 79.6],
    tagline: "Sacred geometry from the Himalayan foothills",
    tools: "Drawn with the fingers (specifically the ring finger).",
    surface: "Floors and walls of houses/courtyards.",
    colours: "Geru (red clay) base with white Bisvar (rice paste).",
    significance: "Ritualistic art done to seek divine protection. Features motifs like Vasudhara (vertical lines) and footprints of Goddess Lakshmi.",
    translations: {
      hi: { tagline: "हिमालय की तलहटी से पवित्र ज्यामिति", significance: "", tools: "", surface: "", colours: "" },
      bn: { tagline: "হিমালয়ের পাদদেশ থেকে পবিত্র জ্যামিতি", significance: "", tools: "", surface: "", colours: "" },
      ta: { tagline: "இமயமலை அடிவாரத்தின் புனித வடிவியல்", significance: "", tools: "", surface: "", colours: "" },
      gu: { tagline: "", significance: "", tools: "", surface: "", colours: "" },
      mr: { tagline: "हिमालयाच्या पायथ्याशी पवित्र भूमिती", significance: "", tools: "", surface: "", colours: "" }
    }
  }

};
