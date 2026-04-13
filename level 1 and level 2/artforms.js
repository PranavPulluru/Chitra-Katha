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
    community: "The Gondi tribal people of Mandla, Dindori, and Balaghat districts of Madhya Pradesh. The Pardhan Gond sub-group — traditionally the keepers of oral history — are the primary painters.",
    translations: {
      hi: {
        tagline: "हर रेखा में जंगल की धड़कन",
        history: "गोंड कला मध्य भारत की सबसे बड़ी आदिवासी कला परंपराओं में से एक है, जिसे सदियों से गोंडी लोग अपनाते आए हैं। परंपरागत रूप से यह कला त्योहारों के दौरान घरों की मिट्टी की दीवारों और फर्श पर बनाई जाती थी — माना जाता था कि यह सौभाग्य लाती है और बुराई को दूर करती है। इस शैली की पहचान बिंदुओं और डैशों के जटिल पैटर्न से होती है जो हर सतह को भर देते हैं — छाल, मछली के शल्क और पंखों से प्रेरित बनावट। 1980 के दशक में स्वर्गीय जनगढ़ सिंह श्याम ने इस परंपरा को कागज और कैनवास पर उतारा।",
        community: "मध्य प्रदेश के मंडला, डिंडोरी और बालाघाट जिलों के गोंडी आदिवासी लोग। पारधान गोंड उपसमूह — जो परंपरागत रूप से मौखिक इतिहास के संरक्षक हैं — मुख्य चित्रकार हैं।",
        materials: ["प्राकृतिक रंग — कोयला, रंगीन मिट्टी, पौधों का रस", "ऐक्रेलिक और पोस्टर रंग (आधुनिक)", "कागज और कैनवास"],
        tools: ["बाँस की छड़ें", "कलम की नोक", "उंगलियाँ", "महीन ब्रश"]
      },
      bn: {
        tagline: "প্রতিটি রেখায় অরণ্যের স্পন্দন",
        history: "গোন্ড শিল্প মধ্য ভারতের বৃহত্তম উপজাতীয় শিল্প ঐতিহ্যগুলির মধ্যে একটি, যা শতাব্দীর পর শতাব্দী ধরে গোন্ডি মানুষেরা পালন করে আসছেন। ঐতিহ্যগতভাবে উৎসবের সময় ঘরের মাটির দেওয়াল ও মেঝেতে আঁকা হত — বিশ্বাস করা হত এটি সৌভাগ্য আনে এবং অশুভ দূর করে। ১৯৮০-এর দশকে প্রয়াত জনগড় সিং শ্যাম এই ঐতিহ্যকে কাগজ ও ক্যানভাসে নিয়ে আসেন।",
        community: "মধ্যপ্রদেশের মান্ডলা, দিন্দোরি এবং বালাঘাট জেলার গোন্ডি উপজাতীয় মানুষেরা। পারধান গোন্ড উপগোষ্ঠী — ঐতিহ্যগতভাবে মৌখিক ইতিহাসের রক্ষক — প্রধান চিত্রশিল্পী।",
        materials: ["প্রাকৃতিক রঞ্জক — কাঠকয়লা, রঙিন মাটি, গাছের রস", "অ্যাক্রিলিক ও পোস্টার রং (আধুনিক)", "কাগজ ও ক্যানভাস"],
        tools: ["বাঁশের কাঠি", "কলমের নিব", "আঙুল", "সূক্ষ্ম তুলি"]
      },
      ta: {
        tagline: "ஒவ்வொரு கோட்டிலும் காட்டின் துடிப்பு",
        history: "கோண்ட் கலை மத்திய இந்தியாவின் மிகப்பெரிய பழங்குடி கலை மரபுகளில் ஒன்று, நூற்றாண்டுகளாக கோண்டி மக்களால் பின்பற்றப்பட்டு வருகிறது. திருவிழாக்களின்போது வீடுகளின் மண் சுவர்களிலும் தரையிலும் வரையப்பட்டது. 1980களில் ஜன்கர் சிங் ஷ்யாம் இந்த மரபை காகிதம் மற்றும் கேன்வாசில் கொண்டு வந்தார்.",
        community: "மத்தியப் பிரதேசத்தின் மண்டலா, திண்டோரி மற்றும் பாலாகாட் மாவட்டங்களின் கோண்டி பழங்குடி மக்கள். பர்தான் கோண்ட் துணைக்குழு — வாய்வழி வரலாற்றின் பாதுகாவலர்கள் — முக்கிய ஓவியர்கள்.",
        materials: ["இயற்கை நிறமிகள் — கரி, வண்ண மண், தாவர சாறுகள்", "அக்ரிலிக் மற்றும் போஸ்டர் வண்ணங்கள் (நவீன)", "காகிதம் மற்றும் கேன்வாஸ்"],
        tools: ["மூங்கில் குச்சிகள்", "பேனா நிப்புகள்", "விரல்கள்", "நுண்ணிய தூரிகைகள்"]
      },
      gu: {
        tagline: "દરેક રેખામાં જંગલની ધડકન",
        history: "ગોંડ કળા મધ્ય ભારતની સૌથી મોટી આદિવાસી કળા પ્રણાલીઓમાંની એક છે, જે સદીઓથી ગોંડી લોકો દ્વારા ચાલી આવે છે. તહેવારોના સમયે ઘરોની માટીની દીવાલો અને ફ્લોર પર ચીતરવામાં આવતી. 1980ના દાયકામાં સ્વ. જનગઢ સિંહ શ્યામે આ પ્રણાલીને કાગળ અને કૅન્વાસ પર લાવ્યા.",
        community: "મધ્ય પ્રદેશના મંડલા, ડિંડોરી અને બાલાઘાટ જિલ્લાઓના ગોંડી આદિવાસી લોકો. પારધાન ગોંડ ઉપ-જૂથ — પ્રણાલીગત ઇતિહાસના રક્ષકો — મુખ્ય ચિત્રકારો છે.",
        materials: ["કુદરતી રંગ — ચારકોલ, રંગીન માટી, વનસ્પતિ રસ", "ઍક્રિલિક અને પોસ્ટર રંગ (આધુનિક)", "કાગળ અને કૅન્વાસ"],
        tools: ["વાંસની સળીઓ", "પેનની નીબ", "આંગળીઓ", "ઝીણી붓"]
      },
      mr: {
        tagline: "प्रत्येक रेषेत जंगलाची स्पंदने",
        history: "गोंड कला मध्य भारतातील सर्वात मोठ्या आदिवासी कला परंपरांपैकी एक आहे, जी शतकानुशतके गोंडी लोक जोपासत आले आहेत. सणांच्या वेळी घरांच्या मातीच्या भिंती आणि जमिनीवर रंगवली जात असे. १९८०च्या दशकात स्व. जनगढ सिंग श्याम यांनी ही परंपरा कागद व कॅनव्हासवर आणली.",
        community: "मध्य प्रदेशातील मंडला, डिंडोरी आणि बालाघाट जिल्ह्यांतील गोंडी आदिवासी लोक. पारधान गोंड उपगट — मौखिक इतिहासाचे पारंपरिक रक्षक — हे प्रमुख चित्रकार आहेत.",
        materials: ["नैसर्गिक रंगद्रव्ये — कोळसा, रंगीत माती, वनस्पतींचा रस", "अॅक्रिलिक आणि पोस्टर रंग (आधुनिक)", "कागद आणि कॅनव्हास"],
        tools: ["बांबूच्या काठ्या", "पेनची निब", "बोटे", "बारीक ब्रश"]
      }
    }
  },

  "Kalighat of Bengal": {
    name: "Kalighat Painting",
    region: "West Bengal",
    coords: [22.52, 88.36],
    tagline: "Sacred devotion meets sharp social wit",
    history: "Kalighat painting was born in the 19th century in the lanes around the Kalighat Kali temple in Kolkata. Patua scroll painters (Chitrakaras) relocated near the temple to sell devotional images to pilgrims. Their style — bold outlines, flat colour washes, and fluid brushwork — was revolutionary. Over time, subjects shifted from gods to biting social commentary on the Bengali colonial elite, making Kalighat one of the earliest traditions of social satire in Indian art. The style later influenced Jamini Roy, one of India's most celebrated modernists.",
    materials: ["Watercolour on mill-made paper", "Natural mineral pigments", "Chalk whites"],
    tools: ["Fine brushes, traditionally squirrel-hair", "Reed pens for outlines"],
    community: "The Patua or Chitrakar community of West Bengal, centred around the Kalighat neighbourhood of Kolkata and the Midnapore district villages.",
    translations: {
      hi: {
        tagline: "पवित्र भक्ति और तीखी सामाजिक व्यंग्य का संगम",
        history: "कालीघाट चित्रकला का जन्म 19वीं सदी में कोलकाता के कालीघाट काली मंदिर के आसपास की गलियों में हुआ। पटुआ स्क्रॉल चित्रकार (चित्रकार) मंदिर के पास आकर श्रद्धालुओं को भक्ति चित्र बेचने लगे। इस शैली ने बाद में जामिनी राय जैसे महान आधुनिकतावादियों को प्रभावित किया।",
        community: "पश्चिम बंगाल का पटुआ या चित्रकार समुदाय, कोलकाता के कालीघाट क्षेत्र और मिदनापुर जिले के गाँवों में केंद्रित।",
        materials: ["मिल-निर्मित कागज पर जलरंग", "प्राकृतिक खनिज रंगद्रव्य", "चॉक सफेद"],
        tools: ["महीन ब्रश, परंपरागत रूप से गिलहरी के बालों के", "रूपरेखा के लिए रीड पेन"]
      },
      bn: {
        tagline: "পবিত্র ভক্তি মেলে তীক্ষ্ণ সামাজিক ব্যঙ্গের সাথে",
        history: "কালীঘাট চিত্রকলার জন্ম ১৯শ শতাব্দীতে কলকাতার কালীঘাট কালী মন্দিরের আশেপাশের গলিতে। পটুয়া স্ক্রল চিত্রশিল্পীরা (চিত্রকর) মন্দিরের কাছে এসে তীর্থযাত্রীদের কাছে ভক্তিমূলক চিত্র বিক্রি করতেন। এই শৈলী পরবর্তীতে যামিনী রায়কে প্রভাবিত করেছিল।",
        community: "পশ্চিমবঙ্গের পটুয়া বা চিত্রকর সম্প্রদায়, কলকাতার কালীঘাট এলাকা এবং মেদিনীপুর জেলার গ্রামগুলিকে কেন্দ্র করে।",
        materials: ["মিল-তৈরি কাগজে জলরং", "প্রাকৃতিক খনিজ রঞ্জক", "চক সাদা"],
        tools: ["সূক্ষ্ম তুলি, ঐতিহ্যগতভাবে কাঠবিড়ালির চুলের", "রূপরেখার জন্য রিড কলম"]
      },
      ta: {
        tagline: "புனித பக்தியும் கூர்மையான சமூக நகைச்சுவையும்",
        history: "காளிகாட் ஓவியம் 19ஆம் நூற்றாண்டில் கொல்கத்தாவின் காளிகாட் காளி கோயிலைச் சுற்றியுள்ள தெருக்களில் தோன்றியது. பட்டுவா ஓவியர்கள் புனித யாத்ரிகர்களுக்கு பக்தி படங்கள் விற்றனர். இந்த பாணி பின்னர் ஜாமினி ராயை பாதித்தது.",
        community: "மேற்கு வங்கத்தின் பட்டுவா அல்லது சித்திரகர் சமூகம், கொல்கத்தாவின் காளிகாட் மற்றும் மிட்னாபூர் மாவட்ட கிராமங்களை மையமாகக் கொண்டது.",
        materials: ["மில் தயாரிப்பு காகிதத்தில் நீர்வண்ணம்", "இயற்கை கனிம நிறமிகள்", "சுண்ணாம்பு வெள்ளை"],
        tools: ["நுண்ணிய தூரிகைகள், பாரம்பரியமாக அணில் மயிர்", "வரையறைக்கு நாணல் பேனா"]
      },
      gu: {
        tagline: "પવિત્ર ભક્તિ અને તીક્ષ્ણ સામાજિક વ્યંગ્ય",
        history: "કાળીઘાટ ચિત્રકળાનો જન્મ 19મી સદીમાં કોલકાતાના કાળીઘાટ કાળી મંદિરની આસપાસ થયો. પટુઆ સ્ક્રૉલ ચિત્રકારો (ચિત્રકર) મંદિર પાસે આવી ભક્તોને ધાર્મિક ચિત્રો વેચતા. આ શૈલીએ બાદ્ જામિની રૉયને પ્રભાવિત કર્યા.",
        community: "પশ્ચિમ બંગાળનો પટુઆ અથવા ચિત્રકર સમુદાય, કોલકાતાના કાળીઘાટ વિસ્તાર અને મિડ્નાપુર જિલ્લાના ગામોમાં કેન્દ્રિત.",
        materials: ["મિલ-નિર્મિત કાગળ પર જળરંગ", "કુદરતી ખનિજ રંગ", "ચૉક સફેદ"],
        tools: ["ઝીણી붓, પ્રણાલીગત ખિસકોલીના વાળ", "રૂપરેખા માટે રીડ પેન"]
      },
      mr: {
        tagline: "पवित्र भक्ती आणि तीव्र सामाजिक व्यंग्य",
        history: "कालीघाट चित्रकला १९व्या शतकात कोलकात्याच्या कालीघाट काली मंदिराजवळील गल्ल्यांमध्ये जन्मली. पटुआ स्क्रोल चित्रकार (चित्रकर) मंदिराजवळ येऊन भक्तांना भक्तिपर चित्रे विकत असत. या शैलीने नंतर जामिनी रॉय यांना प्रभावित केले.",
        community: "पश्चिम बंगालचा पटुआ किंवा चित्रकर समाज, कोलकात्याच्या कालीघाट परिसर आणि मिदनापूर जिल्ह्यातील गावांमध्ये केंद्रित.",
        materials: ["मिल-निर्मित कागदावर जलरंग", "नैसर्गिक खनिज रंगद्रव्ये", "खडू पांढरा"],
        tools: ["बारीक ब्रश, परंपरेने खारीच्या केसांचे", "रूपरेखेसाठी रीड पेन"]
      }
    }
  },

  "Soharai of Jharkhand": {
    name: "Sohrai Painting",
    region: "Jharkhand",
    coords: [24.0, 85.3],
    tagline: "A harvest celebration painted on living walls",
    history: "Sohrai is both a harvest festival and an art form of the tribal communities of Hazaribagh, Jharkhand. Each year after the harvest, women repaint the walls of their homes with animals, trees, and geometric patterns — a celebration of the cattle and the land that sustains the community. The art is tied to animist beliefs: each motif carries meaning connected to fertility, protection, and gratitude. The natural earth pigments are sourced entirely from the local landscape — white clay, red and black ochre, and manganese.",
    materials: ["White clay (dudhi mitti)", "Red ochre (geru)", "Black manganese oxide", "Yellow ochre"],
    tools: ["Fingers", "Chewed datun (neem) sticks", "Cut twigs"],
    community: "Women of the Santhali, Oraon, and Munda tribal communities in the Hazaribagh region of Jharkhand. The art is passed exclusively between women.",
    translations: {
      hi: {
        tagline: "जीवित दीवारों पर चित्रित फसल उत्सव",
        history: "सोहराई झारखंड के हजारीबाग के आदिवासी समुदायों का एक फसल उत्सव और कला रूप दोनों है। हर साल फसल के बाद, महिलाएं अपने घरों की दीवारों पर जानवरों, पेड़ों और ज्यामितीय आकृतियों से पुनः रंग करती हैं — पशुओं और भूमि का जश्न जो समुदाय को जीवित रखती है। प्राकृतिक रंगद्रव्य पूरी तरह स्थानीय परिदृश्य से प्राप्त किए जाते हैं।",
        community: "झारखंड के हजारीबाग क्षेत्र में संथाली, उराँव और मुंडा आदिवासी समुदायों की महिलाएं। यह कला विशेष रूप से महिलाओं के बीच हस्तांतरित होती है।",
        materials: ["सफेद मिट्टी (दूधी मिट्टी)", "लाल गेरू", "काला मैंगनीज ऑक्साइड", "पीला गेरू"],
        tools: ["उंगलियाँ", "चबाई हुई दातून (नीम) की छड़ें", "कटी हुई टहनियाँ"]
      },
      bn: {
        tagline: "জীবন্ত দেওয়ালে আঁকা ফসল উৎসব",
        history: "সোহরাই ঝাড়খণ্ডের হাজারিবাগের উপজাতীয় সম্প্রদায়ের একটি ফসল উৎসব এবং শিল্পকলা উভয়ই। প্রতি বছর ফসল কাটার পর, মহিলারা তাদের ঘরের দেওয়ালে পশু, গাছ ও জ্যামিতিক নকশা দিয়ে রঙ করেন। প্রাকৃতিক মাটির রঙ সম্পূর্ণ স্থানীয় প্রকৃতি থেকে নেওয়া হয়।",
        community: "ঝাড়খণ্ডের হাজারিবাগ অঞ্চলের সাঁওতালি, ওঁরাও এবং মুন্ডা উপজাতীয় সম্প্রদায়ের মহিলারা। এই শিল্পকলা শুধুমাত্র মহিলাদের মধ্যে হস্তান্তরিত হয়।",
        materials: ["সাদা মাটি (দুধি মাটি)", "লাল গেরু", "কালো ম্যাঙ্গানিজ অক্সাইড", "হলুদ গেরু"],
        tools: ["আঙুল", "চিবানো দাঁতন (নিম) কাঠি", "কাটা ডালপালা"]
      },
      ta: {
        tagline: "உயிரோட்டமான சுவர்களில் வரையப்பட்ட அறுவடை கொண்டாட்டம்",
        history: "சோஹ்ராய் ஜார்க்கண்டின் ஹஜாரிபாக் பகுதியின் பழங்குடி சமூகங்களின் அறுவடை திருவிழாவும் கலை வடிவமும் ஆகும். ஒவ்வொரு ஆண்டும் அறுவடைக்குப் பிறகு, பெண்கள் தங்கள் வீட்டின் சுவர்களை விலங்குகள், மரங்கள் மற்றும் வடிவியல் வடிவங்களால் மீண்டும் வரைவார்கள்.",
        community: "ஜார்க்கண்டின் ஹஜாரிபாக் பகுதியில் உள்ள சந்தாலி, ஒராவோன் மற்றும் முண்டா பழங்குடி சமூகங்களின் பெண்கள். இந்த கலை பிரத்தியேகமாக பெண்களிடையே கடத்தப்படுகிறது.",
        materials: ["வெள்ளை களிமண் (தூதி மிட்டி)", "சிவப்பு கெரு", "கருப்பு மாங்கனீஸ் ஆக்சைடு", "மஞ்சள் கெரு"],
        tools: ["விரல்கள்", "மெல்லப்பட்ட நீம் குச்சிகள்", "வெட்டப்பட்ட கிளைகள்"]
      },
      gu: {
        tagline: "જીવંત દીવાલો પર ચીતરેલ લણણી ઉત્સવ",
        history: "સોહરાઈ ઝારખંડના હઝારીબાગ જિલ્લાના આદિવાસી સમાજોનો લણણી ઉત્સવ અને કળા સ્વરૂપ બંને છે. દર વર્ષે લણણી પછી, સ્ત્રીઓ ઘરોની દીવાલો ફરી રંગે છે. કુદરતી રંગ સ્થાનિક ભૂગોળ પરથી મળે છે।",
        community: "ઝારખંડના હઝારીબાગ ક્ષેત્રના સંથાળી, ઓરાઓન અને મુન્ડા આદિવાસી સ્ત્રીઓ. આ કળા ફક્ત સ્ત્રીઓ વચ્ચે જ પ્રસારિત થાય છે.",
        materials: ["સફેદ માટી (દૂધી મિટ્ટી)", "લાલ ગેરુ", "કાળો મૅન્ગેનીઝ ઑક્સાઇડ", "પીળો ગેરુ"],
        tools: ["આંગળીઓ", "ચવેડેલ ડાટું (લીમડો) ની છડીઓ", "કાપેલ ડાળીઓ"]
      },
      mr: {
        tagline: "जिवंत भिंतींवर रेखाटलेला कापणी उत्सव",
        history: "सोहराई हे झारखंडच्या हजारीबाग प्रदेशातील आदिवासी समाजांचा कापणी उत्सव आणि कला प्रकार दोन्ही आहे. दरवर्षी कापणीनंतर महिला घरांच्या भिंती प्राण्यांनी, झाडांनी आणि भौमितिक आकृत्यांनी पुन्हा रंगवतात. नैसर्गिक रंगद्रव्ये स्थानिक परिसरातूनच मिळवली जातात.",
        community: "झारखंडच्या हजारीबाग प्रदेशातील संथाली, उराँव आणि मुंडा आदिवासी समाजांच्या महिला. ही कला केवळ महिलांमध्येच हस्तांतरित होते.",
        materials: ["पांढरी माती (दूधी मिट्टी)", "लाल गेरू", "काळा मँगनीज ऑक्साइड", "पिवळा गेरू"],
        tools: ["बोटे", "चावलेल्या दातून (कडुलिंब) काठ्या", "कापलेल्या फांद्या"]
      }
    }
  },

  "Tanjore Painting of Tamil Nadu": {
    name: "Tanjore Painting",
    region: "Tamil Nadu",
    coords: [10.78, 79.13],
    tagline: "Devotion rendered in gold and gemstone",
    history: "Tanjore painting flourished under the Nayak rulers of Thanjavur in the 16th century and reached its peak under the Maratha court. These richly textured devotional works are built up in layers — chalk and glue are applied to a cotton-cloth-covered wooden board, gold foil is pressed onto raised gesso forms, and semi-precious stones inlaid as jewellery. The result is an icon that seems to glow from within. Subjects are almost exclusively divine — Vishnu, Krishna, and Lakshmi — depicted with serene three-quarter-face compositions.",
    materials: ["Wooden board covered in cotton cloth", "Chalk powder and glue (gesso base)", "Gold foil", "Semi-precious stones and coloured glass", "Natural and synthetic pigments"],
    tools: ["Fine brushes", "Stylus for embossing gesso", "Burnishing tools for gold"],
    community: "Traditional artist families (Nayaka community) of Thanjavur, Tamil Nadu. The craft is passed down through family workshops called shilpa shalas.",
    translations: {
      hi: {
        tagline: "सोने और रत्नपाषाण में ढली भक्ति",
        history: "तंजावुर चित्रकारी 16वीं शताब्दी में तंजावुर के नायक शासकों के अधीन फली-फूली। ये समृद्ध भक्ति कृतियाँ परतों में बनाई जाती हैं — लकड़ी के तख्ते पर कपड़ा, सोने का वर्क, और अर्ध-कीमती पत्थर। विषय लगभग हमेशा दैवीय होते हैं — विष्णु, कृष्ण और लक्ष्मी।",
        community: "तमिलनाडु के तंजावुर के पारंपरिक कलाकार परिवार (नायक समुदाय)। यह शिल्प शिल्प शालाओं नामक पारिवारिक कार्यशालाओं में पीढ़ी दर पीढ़ी चलता है।",
        materials: ["रूई से ढका लकड़ी का तख्ता", "चॉक पाउडर और गोंद (जिप्सम आधार)", "सोने का वर्क", "अर्ध-कीमती पत्थर और रंगीन काँच", "प्राकृतिक और सिंथेटिक रंगद्रव्य"],
        tools: ["महीन ब्रश", "जिप्सम उभारने के लिए स्टाइलस", "सोने को पॉलिश करने के उपकरण"]
      },
      bn: {
        tagline: "সোনা ও রত্নপাথরে গড়া ভক্তি",
        history: "তাঞ্জাভুর চিত্রকলা ষোড়শ শতাব্দীতে তাঞ্জাভুরের নায়ক শাসকদের আমলে বিকশিত হয়। এই সমৃদ্ধ ভক্তিমূলক চিত্রকর্ম স্তরে স্তরে নির্মিত হয় — কাঠের তক্তায় কাপড়, সোনার পাত, এবং উপরত্ন। বিষয়বস্তু প্রায় সর্বদা দৈব — বিষ্ণু, কৃষ্ণ ও লক্ষ্মী।",
        community: "তামিলনাড়ুর তাঞ্জাভুরের ঐতিহ্যবাহী শিল্পী পরিবার (নায়ক সম্প্রদায়)। শিল্পকলা শিল্প শালা নামক পারিবারিক কর্মশালায় প্রজন্ম ধরে চলে আসছে।",
        materials: ["তুলায় মোড়া কাঠের তক্তা", "চক গুঁড়া ও আঠা (জিপসাম ভিত্তি)", "সোনার পাত", "উপরত্ন ও রঙিন কাচ", "প্রাকৃতিক ও সিন্থেটিক রঞ্জক"],
        tools: ["সূক্ষ্ম তুলি", "জিপসাম খোদাইয়ের স্টাইলাস", "সোনা মসৃণ করার সরঞ্জাম"]
      },
      ta: {
        tagline: "தங்கமும் மணிகளும் செய்யும் பக்தி",
        history: "தஞ்சாவூர் ஓவியம் 16ஆம் நூற்றாண்டில் தஞ்சாவூரின் நாயக்க மன்னர்களின் காலத்தில் செழித்தது. இந்த பணக்கார பக்தி படைப்புகள் அடுக்குகளாக உருவாக்கப்படுகின்றன — தங்க தகடு மற்றும் அரை விலையுயர்ந்த கற்கள் பதிக்கப்படுகின்றன. கருப்பொருள்கள் கிட்டத்தட்ட எப்போதும் தெய்வீகமானவை.",
        community: "தமிழ்நாட்டின் தஞ்சாவூரின் பாரம்பரிய கலைஞர் குடும்பங்கள் (நாயக்க சமூகம்). இந்த கலை சில்ப சாலா என்ற குடும்ப பட்டறைகளில் தலைமுறை தலைமுறையாக கடத்தப்படுகிறது.",
        materials: ["பருத்தி துணி மூடிய மரப்பலகை", "சுண்ணாம்பு தூள் மற்றும் பசை", "தங்க தகடு", "அரை விலையுயர்ந்த கற்கள்", "இயற்கை மற்றும் செயற்கை நிறமிகள்"],
        tools: ["நுண்ணிய தூரிகைகள்", "ஜிப்சம் வடிவமைக்க ஸ்டைலஸ்", "தங்கம் தேய்க்கும் கருவிகள்"]
      },
      gu: {
        tagline: "સોના અને રત્નમાં ઢળેલ ભક્તિ",
        history: "તાંજોર ચિત્રકળા 16મી સદીમાં તાંજોરના નાયક શાસકો હેઠળ ખૂબ ખીલી. આ ભક્તિ કૃતિઓ સ્તરોમાં બનાવવામાં આવે છે — સોનાનો વરખ અને અર્ધ-કીમતી પત્થરો. વિષયો લગભગ હંમેશા દૈવ — વિષ્ણુ, કૃષ્ણ અને લક્ષ્મી.",
        community: "તામિલ નાડુના તાંજોરના પ્રણાલીગત કળાકાર પરિવારો (નાયક સમુદાય). શિલ્પ શાળા નામની પારિવારિક કાર્યશાળાઓ દ્વારા.",
        materials: ["સુતરાઉ કાપડ-ઢાંકેલ લાકડાનું પૂઠું", "ચૉક પાઉડર અને ગ\u0AC1\u0A82ber(જિપ્સમ)", "સોનાનો વરખ", "અર્ધ-કીમતી પત્થર", "કુદ. ને કૃ. રંગ"],
        tools: ["ઝીણી붓", "ઉભારવા스타이লસ", "સોના ઘ\u0AC1\u0A82સવા સાધ\u0AA8"]
      },
      mr: {
        tagline: "सोने आणि रत्नांमध्ये रेखाटलेली भक्ती",
        history: "तंजावूर चित्रकला १६व्या शतकात तंजावूरच्या नायक राज्यकर्त्यांच्या काळात फुलली. या समृद्ध भक्तिपर कलाकृती थरांमध्ये बनवल्या जातात — सोन्याचे वर्क आणि अर्ध-कीमती दगड. विषय जवळपास नेहमीच दैवीय असतात — विष्णू, कृष्ण आणि लक्ष्मी.",
        community: "तामिळनाडूच्या तंजावूरचे पारंपरिक कलाकार कुटुंबे (नायक समाज). शिल्प शाळा नावाच्या कौटुंबिक कार्यशाळांमध्ये ही कला पिढ्यानपिढ्या चालत आली आहे.",
        materials: ["कापसाने झाकलेली लाकडी पाटी", "खडू पावडर आणि गोंद (जिप्सम बेस)", "सोन्याचे वर्क", "अर्ध-कीमती दगड", "नैसर्गिक आणि सिंथेटिक रंगद्रव्ये"],
        tools: ["बारीक ब्रश", "जिप्सम उठवण्यासाठी स्टाइलस", "सोने पॉलिश करण्याची साधने"]
      }
    }
  },

  "Kalamkari Of Tamil Nadu": {
    name: "Kalamkari",
    region: "Andhra Pradesh",
    coords: [14.5, 79.5],
    tagline: "A pen's journey through myth and cloth",
    history: "Kalamkari — literally 'pen work' (kalam = pen, kari = craft) — is a 3,000-year-old tradition of hand-painting or block-printing on cloth using natural dyes. Two distinct schools exist: the Srikalahasti style is entirely hand-drawn with a bamboo pen, depicting temple narratives from the Ramayana and Mahabharata; the Machilipatnam style uses hand-carved wooden blocks and shows Persian floral influence from the Mughal period. Both traditions rely on a complex 17-step process of mordanting, dyeing, and washing.",
    materials: ["Handspun cotton or silk", "Natural dyes — indigo, pomegranate rind, iron rust, myrobalan", "Mordants — alum and iron"],
    tools: ["Bamboo pen (kalam) tipped with a fibre bundle", "Hand-carved wooden blocks (Machilipatnam style)"],
    community: "Artists of Srikalahasti (Devanga caste) and Machilipatnam (Khatri community) in Andhra Pradesh.",
    translations: {
      hi: {
        tagline: "कलम की यात्रा मिथक और वस्त्र के माध्यम से",
        history: "कलमकारी — शाब्दिक अर्थ 'कलम का काम' (कलम = कलम, कारी = शिल्प) — कपड़े पर प्राकृतिक रंगों से हाथ से चित्रकारी या ब्लॉक प्रिंटिंग की 3,000 साल पुरानी परंपरा है। दो अलग-अलग शैलियाँ हैं: श्रीकालहस्ती शैली पूरी तरह हस्तनिर्मित है, मंदिर की कथाएँ चित्रित करती है; मछलीपट्टनम शैली हस्त-नक्काशीदार लकड़ी के ब्लॉक का उपयोग करती है।",
        community: "आंध्र प्रदेश में श्रीकालहस्ती (देवांगा जाति) और मछलीपट्टनम (खत्री समुदाय) के कलाकार।",
        materials: ["हाथ से बुना सूती या रेशमी कपड़ा", "प्राकृतिक रंग — नील, अनार की छाल, लोहे की जंग, मायरोबलन", "मॉर्डेंट — फिटकरी और लोहा"],
        tools: ["बाँस की कलम (कलम) जिसके सिरे पर रेशे का गुच्छा", "हस्त-नक्काशीदार लकड़ी के ब्लॉक (मछलीपट्टनम शैली)"]
      },
      bn: {
        tagline: "কলমের পথে পৌরাণিক কাহিনি ও বস্ত্রের মধ্য দিয়ে",
        history: "কালামকারি — আক্ষরিক অর্থে 'কলম-কাজ' — তিন হাজার বছরের পুরনো ঐতিহ্য। দুটি আলাদা শৈলী রয়েছে: শ্রীকালহস্তি শৈলী সম্পূর্ণ হস্তনির্মিত; মাসুলিপত্তনম শৈলী হস্তনির্মিত কাঠের ব্লক ব্যবহার করে।",
        community: "অন্ধ্রপ্রদেশের শ্রীকালহস্তি (দেবাঙ্গা জাতি) এবং মাসুলিপত্তনম (খাত্রি সম্প্রদায়) এর শিল্পীরা।",
        materials: ["হাতে বোনা তুলো বা রেশম", "প্রাকৃতিক রং — নীল, ডালিমের ছাল, লোহার মরিচা, মাইরোবালান", "মর্ডেন্ট — ফিটকিরি ও লোহা"],
        tools: ["বাঁশের কলম (কালাম) তন্তু বান্ডেল টিপ সহ", "হাতে খোদাই করা কাঠের ব্লক (মাসুলিপত্তনম শৈলী)"]
      },
      ta: {
        tagline: "கடவுளின் கதையை துணியில் எழுதும் கலம்",
        history: "கலம்காரி — 'கலம் வேலை' என்று பொருள் — ஆடைகளில் இயற்கை சாயங்களால் கை-வரைதல் அல்லது தொகுதி-அச்சிடுதலின் 3,000 ஆண்டுகள் பழமையான மரபு. இரண்டு தனித்துவமான பள்ளிகள் உள்ளன: ஸ்ரீகாளஹஸ்தி பாணி முழுக்க கைவினைஞர்; மச்சிலிப்பட்னம் பாணி கை-செதுக்கப்பட்ட மரத் தொகுதிகளைப் பயன்படுத்துகிறது.",
        community: "ஆந்திரப் பிரதேசத்தில் ஸ்ரீகாளஹஸ்தி (தேவாங்க சாதி) மற்றும் மச்சிலிப்பட்னம் (கட்ரி சமூகம்) கலைஞர்கள்.",
        materials: ["கைமுறையாக நெய்த பருத்தி அல்லது பட்டு", "இயற்கை சாயங்கள் — நீலம், மாதுளை தோல், இரும்பு துரு, மைரோபலன்", "மார்டன்ட்கள் — படிகாரம் மற்றும் இரும்பு"],
        tools: ["இழை கட்டு நுனி கொண்ட மூங்கில் பேனா (கலம்)", "கை-செதுக்கப்பட்ட மரத் தொகுதிகள்"]
      },
      gu: {
        tagline: "પૌરાણિક કથા અને કાપડ વચ્ચે કલમની સફર",
        history: "કળામ્કારી — 'કળમ-કામ' — કાપડ પર કુદરતી રંગોથી હાથ-ચિત્ર કરવાની ૩,૦૦૦ વર્ષ જૂની પ્રણાલી. બે અલગ શૈળીઓ: શ્રીકળહસ્તિ — સંપૂર્ણ હસ્તનિર્મિત; મશ્ઇલિપટ્ટનમ — હસ્ત-કોતરેલ લાકડાના બ્લૉક.",
        community: "આંધ્ર પ્રદેશમાં શ્રીકળહસ્તિ (દેવાંગ જ્ઞાતિ) અને મશ્ઇલિપટ્ટનમ (ખત્રી સમુદાય)ના કળાકારો.",
      },
      mr: {
        tagline: "पौराणिक कथा आणि कापडातून कलमाचा प्रवास",
        history: "कलमकारी — शब्दशः 'कलमाचे काम' — नैसर्गिक रंगांनी कापडावर हाताने चित्र काढण्याची किंवा ब्लॉक छपाईची ३,००० वर्षे जुनी परंपरा. दोन वेगळ्या शैली आहेत: श्रीकालहस्ती शैली पूर्णपणे हाताने बनवलेली; मछलीपट्टनम शैली हस्त-कोरीव लाकडी ब्लॉक वापरते.",
        community: "आंध्र प्रदेशातील श्रीकालहस्ती (देवांग जात) आणि मछलीपट्टनम (खत्री समाज) येथील कलाकार.",
        materials: ["हाताने विणलेले सुती किंवा रेशमी कापड", "नैसर्गिक रंग — नील, डाळिंबाची साल, लोखंडाचा गंज, मायरोबलन", "मॉर्डन्ट — तुरटी आणि लोखंड"],
        tools: ["बाँबूची कलम (कलम) तंतू बंडल टोकासह", "हस्त-कोरीव लाकडी ब्लॉक (मछलीपट्टनम शैली)"]
      }
    }
  },

  "Sanji Art  of Uttar Pradesh": {
    name: "Sanji",
    region: "Uttar Pradesh / Rajasthan",
    coords: [27.5, 77.7],
    tagline: "Stencilled flowers as an offering to Krishna",
    history: "Sanji is a devotional stencil art associated with the worship of Lord Krishna, practiced in the Mathura-Vrindavan region and Rajasthan. During the Sharad season (autumn), priests and devotees create elaborate floor and wall patterns using hand-cut stencils and natural materials — flower petals, coloured powders, and leaves. In temples, Sanji was traditionally made with cow dung paste on the floor, then decorated with pigments. The patterns depict scenes from Krishna's life with intricate geometric borders.",
    materials: ["Flower petals", "Coloured powders (gulal)", "Leaves and seeds", "Cow dung paste (traditional)"],
    tools: ["Handmade stencils cut from bamboo or thick paper", "Hands and fingers"],
    community: "Brahmin priests and devotees of the Braj region (Mathura-Vrindavan, UP) and Rajasthan, particularly around Jodhpur and Jaipur.",
    translations: {
      hi: {
        tagline: "कृष्ण को समर्पित स्टेंसिल से बने फूल",
        history: "साँझी भगवान कृष्ण की पूजा से जुड़ी एक भक्ति स्टेंसिल कला है, जो मथुरा-वृंदावन क्षेत्र और राजस्थान में प्रचलित है। शरद ऋतु में, पुजारी और भक्त हाथ से काटे गए स्टेंसिल और प्राकृतिक सामग्री — फूलों की पंखुड़ियाँ, रंगीन पाउडर — का उपयोग करके जटिल फर्श और दीवार के पैटर्न बनाते हैं। परंपरागत रूप से मंदिरों में गोबर की लेई पर बनाई जाती थी।",
        community: "ब्रज क्षेत्र (मथुरा-वृंदावन, उत्तर प्रदेश) और राजस्थान के ब्राह्मण पुजारी और भक्त, विशेषकर जोधपुर और जयपुर के आसपास।",
        materials: ["फूलों की पंखुड़ियाँ", "रंगीन पाउडर (गुलाल)", "पत्तियाँ और बीज", "गोबर की लेई (पारंपरिक)"],
        tools: ["बाँस या मोटे कागज से हाथ से बने स्टेंसिल", "हाथ और उंगलियाँ"]
      },
      bn: {
        tagline: "কৃষ্ণের পূজায় স্টেনসিল-কাটা ফুল",
        history: "সাঁঝী ভগবান কৃষ্ণের উপাসনার সাথে যুক্ত একটি ভক্তিমূলক স্টেনসিল শিল্প। শরৎ ঋতুতে, পুরোহিত এবং ভক্তরা হাতে কাটা স্টেনসিল এবং প্রাকৃতিক উপকরণ ব্যবহার করে জটিল মেঝে ও দেওয়ালের নকশা তৈরি করেন।",
        community: "ব্রজ অঞ্চলের (মথুরা-বৃন্দাবন, উ.প্র.) ব্রাহ্মণ পুরোহিত ও ভক্ত এবং রাজস্থান, বিশেষত যোধপুর ও জয়পুরের আশেপাশে।",
        materials: ["ফুলের পাপড়ি", "রঙিন গুঁড়া (গুলাল)", "পাতা ও বীজ", "গোবর পেস্ট (ঐতিহ্যগত)"],
        tools: ["বাঁশ বা মোটা কাগজ থেকে হাতে কাটা স্টেনসিল", "হাত ও আঙুল"]
      },
      ta: {
        tagline: "கிருஷ்ணனுக்கு அர்ப்பணிக்கப்பட்ட ஸ்டென்சில் மலர்கள்",
        history: "சாஞ்சி என்பது மதுரா-விருந்தாவன் பகுதியில் கிருஷ்ண வழிபாட்டுடன் தொடர்புடைய பக்தி ஸ்டென்சில் கலை. இலையுதிர் காலத்தில், பூசாரிகளும் பக்தர்களும் கை-வெட்டப்பட்ட ஸ்டென்சில்கள் மற்றும் இயற்கை பொருட்களைப் பயன்படுத்தி தரை மற்றும் சுவர் வடிவங்கள் உருவாக்குவார்கள்.",
        community: "பிரஜ் பகுதியின் (மதுரா-விருந்தாவன் உ.ப்.) பிராமண பூசாரிகளும் பக்தர்களும் மற்றும் ராஜஸ்தான், குறிப்பாக ஜோத்பூர் மற்றும் ஜெய்பூர் அருகே.",
        materials: ["மலர் இதழ்கள்", "வண்ண தூள் (குலால்)", "இலைகள் மற்றும் விதைகள்", "சாணி விழுது (பாரம்பரியம்)"],
        tools: ["மூங்கில் அல்லது தடிமனான காகிதத்தில் கை-வெட்டப்பட்ட ஸ்டென்சில்கள்", "கைகள் மற்றும் விரல்கள்"]
      },
      gu: {
        tagline: "કૃષ્ણ ભક્તિ માટેનાં સ્ેન્સિલ ફૂલ",
        history: "સાંઝી ભગવાન કૃષ્ણની પૂજા સાથે જોડાયેલી એક ભક્તિ સ્ેન્સિલ કળા છે. શરદ તુમેં પુજારીઓ અને ભક્તો જટિલ ફરસ અને દીવાલ પેટન બનાવે છે.",
        community: "બ્રજ પ્રદેશ (મથુરા-વૃંદાવન, ઉ.પ્ર.) અને રાજસ્થાનના બ્રાહ્મણ પુજારીઓ અને ભક્તો."
      },
      mr: {
        tagline: "कृष्णाला अर्पण केलेली स्टेन्सिलमधून साकारलेली फुले",
        history: "साँझी ही भगवान कृष्णाच्या उपासनेशी संबंधित भक्तिपर स्टेन्सिल कला आहे, जी मथुरा-वृंदावन परिसरात आणि राजस्थानमध्ये प्रचलित आहे. शरद ऋतूत, पुजारी आणि भक्त हाताने कापलेले स्टेन्सिल आणि नैसर्गिक साहित्य वापरून जटिल जमिनी आणि भिंत वरील नमुने तयार करतात.",
        community: "ब्रज प्रदेशातील (मथुरा-वृंदावन, उत्तर प्रदेश) ब्राह्मण पुजारी आणि भक्त, तसेच राजस्थान, विशेषतः जोधपूर आणि जयपूरच्या आसपास.",
        materials: ["फुलांच्या पाकळ्या", "रंगीत पावडर (गुलाल)", "पाने आणि बिया", "शेण (पारंपरिक)"],
        tools: ["बांबू किंवा जड कागदापासून हाताने कापलेले स्टेन्सिल", "हात आणि बोटे"]
      }
    }
  },

  "Warli oh Maharashtra": {
    name: "Warli Painting",
    region: "Maharashtra",
    coords: [19.9, 72.8],
    tagline: "The geometry of community life",
    history: "Warli painting is one of India's oldest surviving art forms, with roots dating to at least 2500 BCE — contemporaneous with Indus Valley civilisation imagery. The Warli tribe of Palghar district traditionally painted on inner walls of homes as part of wedding rituals and harvest ceremonies. The art uses only three geometric shapes: circles (sun and moon), triangles (mountains and trees), and squares (sacred enclosures) — combined into vivid narrative scenes of daily and ceremonial life. White rice paste on a mud-brown wall is the defining visual signature.",
    materials: ["White rice paste", "Mud and cow dung (background preparation)", "Paper and cloth (contemporary)"],
    tools: ["Bamboo sticks chewed at one end", "Fingers"],
    community: "The Warli tribe of Palghar, Thane, and Nashik districts of Maharashtra. Women were the original painters; men began participating from the 1970s.",
    translations: {
      hi: {
        tagline: "सामुदायिक जीवन की ज्यामिति",
        history: "वारली चित्रकला भारत की सबसे पुरानी जीवित कला रूपों में से एक है, जिसकी जड़ें कम से कम 2500 ईसा पूर्व तक जाती हैं। पालघर जिले की वारली जनजाति परंपरागत रूप से विवाह और फसल समारोहों के भाग के रूप में घर की अंदरूनी दीवारों पर चित्र बनाती थी। केवल तीन ज्यामितीय आकार: वृत्त, त्रिभुज और वर्ग।",
        community: "महाराष्ट्र के पालघर, ठाणे और नासिक जिलों की वारली जनजाति। महिलाएं मूल चित्रकार थीं; 1970 के दशक से पुरुषों ने भाग लेना शुरू किया।",
        materials: ["सफेद चावल का लेप", "मिट्टी और गाय का गोबर (पृष्ठभूमि तैयारी)", "कागज और कपड़ा (समकालीन)"],
        tools: ["बाँस की छड़ें जिनके एक सिरे को चबाया गया हो", "उंगलियाँ"]
      },
      bn: {
        tagline: "সামূহিক জীবনের জ্যামিতি",
        history: "ওয়ার্লি চিত্রকলা ভারতের অন্যতম প্রাচীন জীবন্ত শিল্প রূপ, যার শিকড় কমপক্ষে ২৫০০ বিসি পর্যন্ত। পালঘর জেলার ওয়ার্লি উপজাতি ঐতিহ্যগতভাবে বিবাহ ও ফসল অনুষ্ঠানের জন্য ঘরের ভেতরের দেওয়ালে চিত্র আঁকত। মাত্র তিনটি জ্যামিতিক আকৃতি: বৃত্ত, ত্রিভুজ এবং বর্গক্ষেত্র।",
        community: "মহারাষ্ট্রের পালঘর, থানে এবং নাসিক জেলার ওয়ার্লি উপজাতি। মহিলারা মূল চিত্রশিল্পী ছিলেন; ১৯৭০-এর দশক থেকে পুরুষরা অংশগ্রহণ শুরু করেন।",
        materials: ["সাদা চাল পেস্ট", "মাটি ও গোবর (পটভূমি প্রস্তুতি)", "কাগজ ও কাপড় (সমসাময়িক)"],
        tools: ["বাঁশের কাঠি এক প্রান্তে চিবানো", "আঙুল"]
      },
      ta: {
        tagline: "சமூக வாழ்வின் வடிவியல்",
        history: "வார்லி ஓவியம் இந்தியாவின் மிகப் பழைமையான உயிரோட்டமான கலை வடிவங்களில் ஒன்று, குறைந்தது கிமு 2500 வரை வேர்களுடன். பல்கர் மாவட்டத்தின் வார்லி பழங்குடியினர் திருமணம் மற்றும் அறுவடை விழாக்களுக்காக வீட்டின் உட்சுவர்களில் ஓவியம் வரைவார்கள். மூன்று வடிவியல் வடிவங்கள் மட்டுமே: வட்டங்கள், முக்கோணங்கள், சதுரங்கள்.",
        community: "மகாராஷ்டிராவின் பல்கர், தானே மற்றும் நாசிக் மாவட்டங்களின் வார்லி பழங்குடியினர். பெண்கள் அசல் ஓவியர்கள்; 1970களில் இருந்து ஆண்கள் பங்கேற்கத் தொடங்கினார்கள்.",
        materials: ["வெள்ளை அரிசி விழுது", "மண் மற்றும் சாணம் (பின்னணி தயாரிப்பு)", "காகிதம் மற்றும் துணி (நவீன)"],
        tools: ["ஒரு முனையில் மெல்லப்பட்ட மூங்கில் குச்சிகள்", "விரல்கள்"]
      },
      gu: {
        tagline: "સામુદાયિક જીવનની ભૂમિતિ",
        history: "વારળી ચિત્રકળા ભારતના સૌથી પ્રાચીન જીવંત કળા સ્વરૂપોમાંની એક છે, જેની જડ ઓછામાં ઓછી ઈ.સ.પૂ. ૨૫૦૦ સુધી જાય છે. પાલઘર જિલ્લાની વારળી જનજાતિ ઐતિહ્ ywically ow ghar ni andar ni divalo par ow aakti. ફક્ત ત્રણ ભૂમિતિ આકાર: વૃત્ત, ત્રિકોણ, ચોરસ.",
        community: "મહારાષ્ટ્રના પાલઘર, ઠાણે અને નાસિક જિલ્લાઓની વારળી જનજાતિ. સ્ત્રીઓ મૂળ ચિત્રકારો હતી; ૧૯૭૦ ના દાયકાથી પુરુષો ભાગ લેવા લાગ્યા.",
        materials: ["સફેદ ચોખાની લેપન", "માડી અને ગોબર", "કાગળ અને કપડું (આધુનિક)"],
        tools: ["એક છેડો ચવાયેલ વાંસની છડીઓ", "આંગળીઓ"]
      },
      mr: {
        tagline: "सामुदायिक जीवनाची भूमिती",
        history: "वारली चित्रकला ही भारतातील सर्वात जुन्या जिवंत कला प्रकारांपैकी एक आहे, ज्याची मुळे किमान इ.स.पू. २५०० पर्यंत जातात. पालघर जिल्ह्यातील वारली जमात पारंपरिकपणे विवाह आणि कापणी समारंभांसाठी घराच्या आतील भिंतींवर चित्रे रंगवत असे. फक्त तीन भौमितिक आकार: वर्तुळे, त्रिकोण आणि चौरस.",
        community: "महाराष्ट्रातील पालघर, ठाणे आणि नाशिक जिल्ह्यांतील वारली जमात. महिला मूळ चित्रकार होत्या; १९७०च्या दशकापासून पुरुषही सहभागी होऊ लागले.",
        materials: ["पांढरी तांदळाची पेस्ट", "माती आणि शेण (पार्श्वभूमी तयारी)", "कागद आणि कापड (समकालीन)"],
        tools: ["एका टोकाला चावलेल्या बांबूच्या काठ्या", "बोटे"]
      }
    }
  },

  "Phad of Rajasthan": {
    name: "Phad Painting",
    region: "Rajasthan",
    coords: [25.3, 74.6],
    tagline: "A portable temple that travels with its story",
    history: "Phad is a large-format scroll painting from Bhilwara and Shahpura, Rajasthan, used as a mobile shrine by Bhopa priest-performers. Scrolls can be 15 to 30 feet long and depict the epic lives of local folk deities Devnarayan and Pabuji in intricate, comic-strip-like panels. The Bhopa carries the Phad on his back, travelling between villages to perform all-night oral epics accompanied by the Ravan Hatta instrument. Traditionally the Phad was never sold and was ceremonially immersed in a river when worn out.",
    materials: ["Handspun cotton cloth", "Natural vegetable dyes", "Mineral pigments"],
    tools: ["Fine brushes", "Bamboo pen", "Ruler for panel borders"],
    community: "The Joshi (Chipa) caste of painters in Bhilwara and Shahpura, Rajasthan. The Bhopa-Bhopi priests are the traditional carriers of the Phad.",
    translations: {
      hi: {
        tagline: "एक पोर्टेबल मंदिर जो अपनी कहानी के साथ यात्रा करता है",
        history: "फड़ राजस्थान के भीलवाड़ा और शाहपुरा का बड़े आकार का स्क्रॉल चित्र है, जिसका उपयोग भोपा पुजारी-कलाकारों द्वारा चलते-फिरते मंदिर के रूप में होता है। स्क्रॉल 15 से 30 फुट तक लंबे हो सकते हैं और स्थानीय लोक देवताओं देवनारायण और पाबूजी के महाकाव्य को दर्शाते हैं।",
        community: "राजस्थान के भीलवाड़ा और शाहपुरा के जोशी (छीपा) जाति के चित्रकार। भोपा-भोपी पुजारी फड़ के पारंपरिक वाहक हैं।",
        materials: ["हाथ से बुना सूती कपड़ा", "प्राकृतिक वनस्पति रंग", "खनिज रंगद्रव्य"],
        tools: ["महीन ब्रश", "बाँस की कलम", "पैनल बॉर्डर के लिए रूलर"]
      },
      bn: {
        tagline: "নিজের গল্পের সাথে ভ্রমণ করা একটি বহনযোগ্য মন্দির",
        history: "ফড়ি রাজস্থানের ভিলওয়াড়া ও শাহপুরার বড় স্ক্রল চিত্র, যা ভোপা পুরোহিত-শিল্পীরা চলমান মন্দির হিসেবে ব্যবহার করেন। স্ক্রল ১৫ থেকে ৩০ ফুট পর্যন্ত লম্বা হতে পারে।",
        community: "রাজস্থানের ভিলওয়াড়া ও শাহপুরার জোশি (চিপা) জাতির চিত্রশিল্পীরা। ভোপা-ভোপি পুরোহিত ফড়ির বাহক।",
        materials: ["হাতে বোনা তুলার কাপড়", "প্রাকৃতিক উদ্ভিজ্জ রং", "খনিজ রঞ্জক"],
        tools: ["সূক্ষ্ম তুলি", "বাঁশের কলম", "প্যানেল বর্ডারের রুলার"]
      },
      ta: {
        tagline: "தனது கதையுடன் பயணிக்கும் நடமாடும் கோயில்",
        history: "பாட் ராஜஸ்தானின் பில்வாரா மற்றும் சாஹ்புராவின் பெரிய சுருள் ஓவியம், போபா பூசாரி-கலைஞர்கள் நடமாடும் கோயிலாகப் பயன்படுத்துகிறார்கள். சுருள்கள் 15 முதல் 30 அடி நீளமிருக்கும்.",
        community: "ராஜஸ்தானின் பில்வாரா மற்றும் சாஹ்புராவின் ஜோஷி (சிபா) சாதி ஓவியர்கள். போபா-போபி பூசாரிகள் பாட்டின் பாரம்பரிய தாங்குபவர்கள்.",
        materials: ["கை நெய்த பருத்தி துணி", "இயற்கை காய்கறி சாயங்கள்", "கனிம நிறமிகள்"],
        tools: ["நுண்ணிய தூரிகைகள்", "மூங்கில் பேனா", "பேனல் எல்லைக்கு அளவுகோல்"]
      },
      gu: {
        tagline: "પોતાની કથા સાથે ભ્રમણ કરતું ચળ\u0AA4 \u0AAE\u0A82\u0AA6\u0ABF\u0AB0",
        history: "\u0AAB\u0AA1 \u0AB0\u0ABE\u0A9C\u0AB8\u0ACD\u0AA5\u0ABE\u0AA8\u0AA8\u0ABE \u0AAD\u0AC0\u0AB2\u0AB5\u0ABE\u0AA1\u0ABE \u0A85\u0AA8\u0AC7 \u0AB6\u0ABE\u0AB9\u0AAA\u0AC1\u0AB0\u0ABE\u0AA8\u0AC0 \u0AAE\u0ACB\u0A9F\u0AC0 \u0AB8\u0ACD\u0A95\u0ACD\u0AB0\u0ACB\u0AB2 \u0A9A\u0ABF\u0AA4\u0ACD\u0AB0\u0A95\u0AB3\u0ABE \u0A9B\u0AC7. \u0AAD\u0ACB\u0AAA\u0ABE \u0AAA\u0AC1\u0A9C\u0ABE\u0AB0\u0AC0\u0A93 \u0A86 \u0AB8\u0ACD\u0A95\u0ACD\u0AB0\u0ACB\u0AB2 \u0A9A\u0AB3\u0AA4\u0AC7\u0AB0 \u0AAE\u0A82\u0AA6\u0ABF\u0AB0 \u0AA4\u0AB0\u0AC0\u0A95\u0AC7 \u0AB5\u0ABE\u0AAA\u0AB0\u0AC7 \u0A9B\u0AC7.",
        community: "\u0AB0\u0ABE\u0A9C\u0AB8\u0ACD\u0AA5\u0ABE\u0AA8\u0AA8\u0ABE \u0AAD\u0AC0\u0AB2\u0AB5\u0ABE\u0AA1\u0ABE \u0A85\u0AA8\u0AC7 \u0AB6\u0ABE\u0AB9\u0AAA\u0AC1\u0AB0\u0ABE\u0AA8\u0ABE \u0A9C\u0ACB\u0AB6\u0AC0 (\u0A9B\u0AC0\u0AAA\u0ABE) \u0A9C\u0A93\u0AA4\u0ABF\u0AA8\u0ABE \u0A9A\u0ABF\u0AA4\u0ACD\u0AB0\u0A95\u0ABE\u0AB0\u0ACB. \u0AAD\u0ACB\u0AAA\u0ABE-\u0AAD\u0ACB\u0AAA\u0AC0 \u0AAA\u0AC1\u0A9C\u0ABE\u0AB0\u0AC0\u0A93 \u0AAB\u0AA1\u0AA8\u0ABE \u0AAA\u0ACD\u0AB0\u0AA3\u0ABE\u0AB2\u0ABF\u0A95 \u0AB5\u0ABE\u0AB9\u0A95 \u0A9B\u0AC7."
      },
      mr: {
        tagline: "स्वतःच्या कथेसह प्रवास करणारे फिरते मंदिर",
        history: "फड हे राजस्थानच्या भीलवाडा आणि शाहपुऱ्याचे मोठ्या आकाराचे स्क्रोल चित्र आहे. भोपा पुजारी-कलाकार हे फिरते मंदिर म्हणून वापरतात. स्क्रोल १५ ते ३० फूट लांब असू शकतात.",
        community: "राजस्थानच्या भीलवाडा आणि शाहपुरामधील जोशी (छीपा) जातीचे चित्रकार. भोपा-भोपी पुजारी फडचे पारंपरिक वाहक आहेत.",
        materials: ["हाताने विणलेले सुती कापड", "नैसर्गिक वनस्पती रंग", "खनिज रंगद्रव्ये"],
        tools: ["बारीक ब्रश", "बांबूची कलम", "पॅनल बॉर्डरसाठी रूलर"]
      }
    }
  },

  "Pichhwai of Rajasthan": {
    name: "Pichhwai Painting",
    region: "Rajasthan",
    coords: [24.93, 73.82],
    tagline: "A living backdrop to the divine",
    history: "Pichhwai — from Sanskrit 'pichhe' (behind) and 'wai' (hanging) — are large devotional cloth paintings hung behind the idol of Shrinathji in the Nathdwara temple near Udaipur. A different Pichhwai is displayed for each festival, season, and time of day, transforming the deity's setting across the year. The paintings depict Krishna's life — Raas Leela, the lotus ponds of Vrindavan, cow-herding scenes — in deep blues, gold, and lotus pink. Each painting may take months to complete.",
    materials: ["Cotton or silk cloth", "Natural mineral dyes", "Gold paint (sona-roopa)"],
    tools: ["Fine squirrel-hair brushes", "Compass for circular compositions"],
    community: "Artist families — primarily the Usta community and Nathdwara Brahmin painters — of Nathdwara, Rajasthan. Several families have practised the tradition for over 400 years.",
    translations: {
      hi: {
        tagline: "देवत्व की जीवंत पृष्ठभूमि",
        history: "पिछवाई — संस्कृत 'पिछे' (पीछे) और 'वाई' (लटकाना) — उदयपुर के पास नाथद्वारा मंदिर में श्रीनाथजी की मूर्ति के पीछे लटकाए जाने वाले बड़े भक्ति कपड़ा चित्र हैं। हर त्योहार, मौसम और दिन के समय के लिए अलग पिछवाई प्रदर्शित की जाती है। गहरे नीले, सोने और कमल गुलाबी रंगों में कृष्ण का जीवन चित्रित किया जाता है।",
        community: "नाथद्वारा, राजस्थान के उस्ता समुदाय और नाथद्वारा ब्राह्मण चित्रकारों के कलाकार परिवार। कई परिवार 400 वर्षों से अधिक समय से यह परंपरा निभा रहे हैं।",
        materials: ["सूती या रेशमी कपड़ा", "प्राकृतिक खनिज रंग", "सोने की पेंट (सोना-रूपा)"],
        tools: ["महीन गिलहरी के बालों के ब्रश", "गोलाकार रचनाओं के लिए कम्पास"]
      },
      bn: {
        tagline: "ঐশ্বরিক দৃশ্যের জীবন্ত পটভূমি",
        history: "পিছওয়াই — সংস্কৃত 'পিছে' (পেছনে) এবং 'ওয়াই' (ঝোলানো) — উদয়পুরের কাছে নাথদ্বারা মন্দিরে শ্রীনাথজির মূর্তির পেছনে ঝোলানো বড় ভক্তিমূলক কাপড়ের চিত্র। প্রতিটি উৎসব, ঋতু এবং দিনের সময়ের জন্য আলাদা পিছওয়াই প্রদর্শিত হয়।",
        community: "রাজস্থানের নাথদ্বারার উস্তা সম্প্রদায় ও নাথদ্বারা ব্রাহ্মণ চিত্রশিল্পী পরিবার। কয়েকটি পরিবার ৪০০ বছরেরও বেশি সময় ধরে এই ঐতিহ্য পালন করছে।",
        materials: ["তুলা বা রেশম কাপড়", "প্রাকৃতিক খনিজ রং", "সোনার রং (সোনা-রূপা)"],
        tools: ["সূক্ষ্ম কাঠবিড়ালির চুলের তুলি", "বৃত্তাকার রচনার জন্য কম্পাস"]
      },
      ta: {
        tagline: "தெய்வீகத்திற்கு உயிரோட்டமான பின்னணி",
        history: "பிச்சுவாய் — 'பின்னால்' என்று பொருள் — உடையப்பூரின் அருகே நாத்த்வாரா கோயிலில் ஸ்ரீநாத்ஜியின் உருவத்திற்குப் பின்னால் தொங்கவிடப்படும் பெரிய பக்தி துணி ஓவியங்கள். ஒவ்வொரு திருவிழா, பருவகாலம் மற்றும் நேரத்திற்கும் வேறு வேறு பிச்சுவாய் காட்டப்படும்.",
        community: "ராஜஸ்தானின் நாத்த்வாராவின் உஸ்தா சமூகம் மற்றும் நாத்த்வாரா பிராமண ஓவியர் குடும்பங்கள். சில குடும்பங்கள் 400 ஆண்டுகளுக்கும் மேலாக இந்த மரபைப் பின்பற்றுகின்றன.",
        materials: ["பருத்தி அல்லது பட்டு துணி", "இயற்கை கனிம சாயங்கள்", "தங்க வண்ணம் (சோனா-ரூபா)"],
        tools: ["நுண்ணிய அணில் மயிர் தூரிகைகள்", "வட்ட அமைப்புகளுக்கு திக்கன்"]
      },
      gu: {
        tagline: "\u0AA6\u0AC8\u0AB5\u0AC0 \u0AAA\u0AC3\u0AB7\u0ACD\u0AA0\u0AAD\u0AC2\u0AAE\u0ABF \u0AA4\u0AB0\u0AC0\u0A95\u0AC7 \u0A9C\u0AC0\u0AB5\u0AA8\u0ACD\u0AA4",
        history: "\u0AAA\u0ABF\u0A9B\u0AB5\u0ABE\u0A88 — '\u0AAA\u0ABE\u0A9B\u0AB3' \u0A85\u0AA8\u0AC7 '\u0AB2\u0A9F\u0A95\u0ABE\u0AB5\u0AB5\u0AC1\u0A82' — \u0A89\u0AA6\u0AAF\u0AAA\u0AC1\u0AB0 \u0AAA\u0ABE\u0AB8\u0AC7 \u0AA8\u0ABE\u0AA5\u0AA6\u0AB5\u0ABE\u0AB0\u0ABE \u0AAE\u0A82\u0AA6\u0ABF\u0AB0\u0AAE\u0ABE\u0A82 \u0AB6\u0ACD\u0AB0\u0AC0\u0AA8\u0ABE\u0AA5\u0A9C\u0AC0\u0AA8\u0AC0 \u0AAE\u0AC2\u0AB0\u0ACD\u0AA4\u0ABF\u0AA8\u0AC0 \u0AAA\u0ABE\u0A9B\u0AB3 \u0AB2\u0A9F\u0A95\u0ABE\u0AB5\u0AA4\u0ABE \u0AAE\u0ACB\u0A9F\u0ABE \u0AAD\u0A95\u0ACD\u0AA4\u0ABF \u0A95\u0AAA\u0AA1\u0ABE\u0AA8\u0ABE \u0A9A\u0ABF\u0AA4\u0ACD\u0AB0\u0ACB \u0A9B\u0AC7.",
        community: "\u0AB0\u0ABE\u0A9C\u0AB8\u0ACD\u0AA5\u0ABE\u0AA8\u0AA8\u0ABE \u0AA8\u0ABE\u0AA5\u0AA6\u0AB5\u0ABE\u0AB0\u0ABE\u0AA8\u0ABE \u0A89\u0AB8\u0ACD\u0AA4\u0ABE \u0AB8\u0AAE\u0AC1\u0AA6\u0ABE\u0AAF \u0A85\u0AA8\u0AC7 \u0AAC\u0ACD\u0AB0\u0ABE\u0AB9\u0ACD\u0AAE\u0AA3 \u0A9A\u0ABF\u0AA4\u0ACD\u0AB0\u0A95\u0ABE\u0AB0 \u0AAA\u0AB0\u0ABF\u0AB5\u0ABE\u0AB0\u0ACB. \u0A95\u0AC7\u0091\u0A9F\u0AB2\u0ABE\u0A82\u0A95 \u0AAA\u0AB0\u0ABF\u0AB5\u0ABE\u0AB0\u0ACB \u0EC900 \u0AB5\u0AB0\u0ACD\u0AB7\u0AA5\u0AC0 \u0AB5\u0AA7\u0AC1 \u0AB8\u0AAE\u0AAF\u0AA5\u0AC0 \u0AA2 \u0A86 \u0AAA\u0ACD\u0AB0\u0AA3\u0ABE\u0AB2\u0ABF\u0A95\u0ABE \u0A9C\u0ABE\u0AB3\u0AB5\u0AC7 \u0A9B\u0AC7."
      },
      mr: {
        tagline: "दैवी उपस्थितीची जिवंत पार्श्वभूमी",
        history: "पिछवाई — संस्कृत 'पिछे' (मागे) आणि 'वाई' (लटकणे) — उदयपूरजवळील नाथद्वारा मंदिरात श्रीनाथजींच्या मूर्तीमागे लटकवल्या जाणाऱ्या मोठ्या भक्तिपर कापडी चित्रे आहेत. प्रत्येक उत्सव, ऋतू आणि वेळेनुसार वेगळी पिछवाई लावली जाते.",
        community: "राजस्थानच्या नाथद्वाराचे उस्ता समाज आणि नाथद्वारा ब्राह्मण चित्रकार कुटुंबे. काही कुटुंबे ४०० वर्षांहून अधिक काळापासून ही परंपरा जोपासत आहेत.",
        materials: ["सूती किंवा रेशमी कापड", "नैसर्गिक खनिज रंग", "सोन्याचा रंग (सोना-रूपा)"],
        tools: ["बारीक खारीच्या केसांचे ब्रश", "वर्तुळाकार रचनेसाठी कंपास"]
      }
    }
  },

  "Madhubani of Bihar": {
    name: "Madhubani Painting",
    region: "Bihar",
    coords: [26.37, 86.07],
    tagline: "The mythology of Mithila in every line",
    history: "Madhubani — also called Mithila painting — originates in the Mithila region of Bihar. Its origins are mythological: King Janaka is said to have commissioned paintings to celebrate the wedding of his daughter Sita to Ram. Traditionally painted by women on freshly plastered walls and floors of homes, the art came to international attention in 1967 when artists began painting on paper during a severe drought, transforming a household ritual into a livelihood. Different castes paint different subjects: Brahmin women depict deities; the Dusadh community paints the snake goddess Kali.",
    materials: ["Natural dyes — turmeric (yellow), indigo (blue), soot (black), sindoor (red)", "Cow dung paste on walls", "Handmade paper"],
    tools: ["Bamboo twigs", "Matchsticks", "Fingers", "Fine brushes"],
    community: "Women of the Mithila region across multiple castes — Brahmin, Kayastha, and Dusadh — centred in Madhubani and Darbhanga districts, Bihar.",
    translations: {
      hi: {
        tagline: "हर रेखा में मिथिला की पौराणिक कथा",
        history: "मधुबनी — जिसे मिथिला चित्रकारी भी कहा जाता है — बिहार के मिथिला क्षेत्र से उत्पन्न होती है। इसकी उत्पत्ति पौराणिक है: राजा जनक ने अपनी बेटी सीता के राम से विवाह का जश्न मनाने के लिए चित्र बनवाए थे। 1967 में एक गंभीर सूखे के दौरान कलाकारों ने कागज पर चित्र बनाना शुरू किया। विभिन्न जातियाँ विभिन्न विषयों को चित्रित करती हैं।",
        community: "बिहार के मधुबनी और दरभंगा जिलों में केंद्रित मिथिला क्षेत्र की कई जातियों — ब्राह्मण, कायस्थ और दुसाध — की महिलाएं।",
        materials: ["प्राकृतिक रंग — हल्दी (पीला), नील (नीला), कालिख (काला), सिंदूर (लाल)", "दीवारों पर गाय के गोबर की लेई", "हस्तनिर्मित कागज"],
        tools: ["बाँस की टहनियाँ", "माचिस की तीलियाँ", "उंगलियाँ", "महीन ब्रश"]
      },
      bn: {
        tagline: "প্রতিটি রেখায় মিথিলার পৌরাণিক কাহিনি",
        history: "মধুবনী — মিথিলা চিত্রকলাও বলা হয় — বিহারের মিথিলা অঞ্চল থেকে উদ্ভূত। এর উৎপত্তি পৌরাণিক: রাজা জনক সীতার রামের সাথে বিবাহ উদযাপনের জন্য চিত্র আঁকার নির্দেশ দিয়েছিলেন। ১৯৬৭ সালের খরার সময় শিল্পীরা কাগজে আঁকা শুরু করেন।",
        community: "বিহারের মধুবনী ও দরভাঙ্গা জেলায় কেন্দ্রিত মিথিলা অঞ্চলের একাধিক জাতির — ব্রাহ্মণ, কায়স্থ ও দুসাধ — মহিলারা।",
        materials: ["প্রাকৃতিক রং — হলুদ, নীল, কালো ধোঁয়া, সিঁদুর", "দেওয়ালে গোবর পেস্ট", "হাতে তৈরি কাগজ"],
        tools: ["বাঁশের ডাল", "দিয়াশলাই কাঠি", "আঙুল", "সূক্ষ্ম তুলি"]
      },
      ta: {
        tagline: "ஒவ்வொரு கோட்டிலும் மிதிலையின் புராணக்கதை",
        history: "மதுபானி — மிதிலா ஓவியம் என்றும் அழைக்கப்படும் — பீகாரின் மிதிலா பகுதியில் தோன்றியது. அதன் தோற்றம் புராணத்துடன் தொடர்புடையது: ஜனகன் சீதையின் ராமனுடன் திருமண கொண்டாட்டத்திற்கு ஓவியங்கள் வரையக் கட்டளையிட்டதாக கூறப்படுகிறது. 1967-ல் கடும் வறட்சியின்போது கலைஞர்கள் காகிதத்தில் வரையத் தொடங்கினார்கள்.",
        community: "பீகாரின் மதுபானி மற்றும் தர்பங்கா மாவட்டங்களை மையமாகக் கொண்ட மிதிலா பகுதியின் பல சாதிகளின் — பிராமண, கயஸ்தா மற்றும் துசாத் — பெண்கள்.",
        materials: ["இயற்கை சாயங்கள் — மஞ்சள், இண்டிகோ, கரி, சிந்தூர்", "சுவர்களில் சாணி விழுது", "கைவினைஞர் காகிதம்"],
        tools: ["மூங்கில் கொம்புகள்", "தீக்குச்சிகள்", "விரல்கள்", "நுண்ணிய தூரிகைகள்"]
      },
      gu: {
        tagline: "\u0AAE\u0ABF\u0AA5\u0ABF\u0AB2\u0ABE\u0AA8\u0AC0 \u0AAA\u0CCF\u0AB0\u0ABE\u0AA3\u0ABF\u0A95 \u0A95\u0AA5\u0ABE \u0AAA\u0ACD\u0AB0\u0AA4\u0ACD\u0AAF\u0AC7\u0A95 \u0AB0\u0AC7\u0A96\u0ABE\u0AAE\u0ABE\u0A82",
        history: "\u0AAE\u0AA7\u0AC1\u0AAC\u0AA8\u0AC0 — \u0AAE\u0ABF\u0AA5\u0ABF\u0AB2\u0ABE \u0A9A\u0ABF\u0AA4\u0ACD\u0AB0\u0A95\u0AB3\u0ABE \u0AA4\u0AB0\u0AC0\u0A95\u0AC7 \u0AAA\u0AA3 \u0A93\u0AB3\u0A96\u0ABE\u0AAF \u0A9B\u0AC7 — \u0AAC\u0ABF\u0AB9\u0ABE\u0AB0\u0AA8\u0ABE \u0AAE\u0ABF\u0AA5\u0ABF\u0AB2\u0ABE \u0AAA\u0ACD\u0AB0\u0AA6\u0AC7\u0AB6\u0AAE\u0ABE\u0A82\u0AA5\u0AC0 \u0A89\u0AA6\u0ACD\u0AAD\u0AB5\u0AC7\u0AB2\u0AC0 \u0A9B\u0AC7. 1967\u0AA8\u0AC0 \u0AA6\u0AC1\u0B2D\u0ABF\u0A95\u0ACD\u0AB7\u0ABE \u0AA6\u0AB0\u0AAE\u0ABF\u0AAF\u0ABE\u0AA8 \u0A95\u0AB3\u0ABE\u0A95\u0ABE\u0AB0\u0ACB\u0A8F \u0A95\u0ABE\u0A97\u0AB3 \u0AAA\u0AB0 \u0A9A\u0ABF\u0AA4\u0ACD\u0AB0\u0A95\u0ABE\u0B0C\u0A95 \u0AB6\u0AB0\u0AC2 \u0A95\u0AB0\u0AC0.",
        community: "\u0AAC\u0ABF\u0AB9\u0ABE\u0AB0\u0AA8\u0ABE \u0AAE\u0AA7\u0AC1\u0AAC\u0AA8\u0AC0 \u0A85\u0AA8\u0AC7 \u0AA6\u0AB0\u0AAD\u0A82\u0A97\u0ABE \u0A9C\u0ABF\u0AB2\u0ACD\u0AB2\u0ABE\u0A93\u0AA8\u0AC0 \u0AAE\u0ABF\u0AA5\u0ABF\u0AB2\u0ABE \u0AAA\u0ACD\u0AB0\u0AA6\u0AC7\u0AB6\u0AA8\u0AC0 \u0AA8\u0ABE\u0AB0\u0AC0\u0A93."
      },
      mr: {
        tagline: "प्रत्येक रेषेत मिथिलेची पौराणिक कथा",
        history: "मधुबनी — मिथिला चित्रकलाही म्हणतात — बिहारच्या मिथिला प्रदेशातून उत्पन्न झाली. तिची उत्पत्ती पौराणिक आहे: राजा जनकाने सीतेच्या रामाशी विवाह साजरा करण्यासाठी चित्रे रंगवण्यास सांगितले होते असे म्हणतात. १९६७च्या दुष्काळात कलाकारांनी कागदावर चित्रे काढणे सुरू केले.",
        community: "बिहारच्या मधुबनी आणि दरभंगा जिल्ह्यांत केंद्रित मिथिला प्रदेशातील अनेक जातींच्या — ब्राह्मण, कायस्थ आणि दुसाध — महिला.",
        materials: ["नैसर्गिक रंग — हळद (पिवळा), नील (निळा), काजळी (काळा), सिंदूर (लाल)", "भिंतींवर शेणाची लेप", "हस्तनिर्मित कागद"],
        tools: ["बांबूच्या फांद्या", "काड्यापेट्याच्या काड्या", "बोटे", "बारीक ब्रश"]
      }
    }
  },

  "Thangka Painting of Sikkim": {
    name: "Thangka Painting",
    region: "Sikkim / Ladakh",
    coords: [27.5, 88.5],
    tagline: "A scroll that opens a portal to enlightenment",
    history: "Thangka are Buddhist scroll paintings on cotton or silk, created as objects of devotion, meditation, and religious teaching. Every element — figure, gesture, colour, and symbol — is precisely prescribed by ancient iconographic texts, and a student painter may spend years learning to draw a single deity correctly. The paintings depict Buddhas, Bodhisattvas, mandalas, and scenes from the life of Siddhartha. Traditional Thangkas use mineral pigments that can last for centuries, with a final stage of gilding in pure gold powder.",
    materials: ["Cotton or silk canvas", "Mineral pigments — malachite, lapis lazuli, cinnabar", "Gold powder", "Animal-hide glue sizing"],
    tools: ["Fine squirrel-hair brushes (some with a single hair)", "Compass and ruler for geometric mandalas", "Burnishing tools for gold"],
    community: "Tibetan Buddhist monks and lay artists in Sikkim, Ladakh, Dharamsala, and Spiti. Training occurs in monastic settings and takes 5–10 years to reach mastery.",
    translations: {
      hi: {
        tagline: "एक स्क्रॉल जो ज्ञान प्राप्ति के द्वार खोलता है",
        history: "थंका सूती या रेशम पर बौद्ध स्क्रॉल चित्र हैं, जो भक्ति, ध्यान और धार्मिक शिक्षा की वस्तु के रूप में बनाए जाते हैं। हर तत्व — आकृति, मुद्रा, रंग और प्रतीक — प्राचीन प्रतिमा विज्ञान ग्रंथों द्वारा सटीक रूप से निर्धारित है। पारंपरिक थंका में खनिज रंगद्रव्य सदियों तक टिक सकते हैं।",
        community: "सिक्किम, लद्दाख, धर्मशाला और स्पीति में तिब्बती बौद्ध भिक्षु और गृहस्थ कलाकार। प्रशिक्षण मठवासी वातावरण में होता है और महारत पाने में 5-10 वर्ष लगते हैं।",
        materials: ["सूती या रेशमी कैनवास", "खनिज रंगद्रव्य — मैलाकाइट, लापिस लाजुली, सिनाबार", "सोने का चूर्ण", "पशु-चर्म का गोंद"],
        tools: ["महीन गिलहरी के बालों के ब्रश", "ज्यामितीय मंडल के लिए कम्पास और रूलर", "सोने को पॉलिश करने के उपकरण"]
      },
      bn: {
        tagline: "জ্ঞানালোকের দরজা খুলে দেওয়া একটি স্ক্রল",
        history: "থাংকা তুলা বা রেশমে তৈরি বৌদ্ধ স্ক্রল চিত্র, যা ভক্তি, ধ্যান এবং ধর্মীয় শিক্ষার বস্তু হিসেবে তৈরি হয়। প্রতিটি উপাদান প্রাচীন প্রতিমালিপি গ্রন্থ দ্বারা নির্ধারিত। ঐতিহ্যগত থাংকায় শতাব্দী ধরে স্থায়ী খনিজ রঞ্জক ব্যবহৃত হয়।",
        community: "সিকিম, লাদাখ, ধর্মশালা এবং স্পিতিতে তিব্বতি বৌদ্ধ সন্ন্যাসী ও গৃহস্থ শিল্পীরা। প্রশিক্ষণ মঠে হয় এবং দক্ষতা অর্জনে ৫-১০ বছর লাগে।",
        materials: ["তুলা বা রেশম ক্যানভাস", "খনিজ রঞ্জক — ম্যালাকাইট, ল্যাপিস লাজুলি, সিনাবার", "সোনার গুঁড়া", "পশুচর্মের আঠা"],
        tools: ["সূক্ষ্ম কাঠবিড়ালির চুলের তুলি", "জ্যামিতিক মন্ডলার জন্য কম্পাস ও রুলার", "সোনা মসৃণ করার সরঞ্জাম"]
      },
      ta: {
        tagline: "ஞானோதயத்திற்கான வாயிலை திறக்கும் சுருள்",
        history: "தங்கா என்பது பருத்தி அல்லது பட்டில் உருவாக்கப்பட்ட பௌத்த சுருள் ஓவியங்கள், பக்தி, தியானம் மற்றும் மத கற்பிக்கும் பொருளாக உருவாக்கப்படுகின்றன. ஒவ்வொரு கூறும் பண்டைய படவியல் நூல்களால் துல்லியமாக வரையறுக்கப்பட்டது.",
        community: "சிக்கிம், லடாக், தர்மசாலா மற்றும் ஸ்பிதியில் உள்ள திபெத்திய பௌத்த துறவிகளும் இல்லத்தரசி கலைஞர்களும். பயிற்சி மடத்தில் நடைபெறுகிறது, தேர்ச்சி பெற 5-10 ஆண்டுகள் ஆகும்.",
        materials: ["பருத்தி அல்லது பட்டு கேன்வாஸ்", "கனிம நிறமிகள் — மேலாக்கைட், லாபிஸ் லசுலி, சின்னாபர்", "தங்கப் பொடி", "விலங்கு தோல் பசை"],
        tools: ["நுண்ணிய அணில் மயிர் தூரிகைகள்", "வடிவியல் மண்டலத்திற்கு திக்கன் மற்றும் அளவுகோல்", "தங்கம் தேய்க்கும் கருவிகள்"]
      },
      gu: {
        tagline: "ज्ञानप्रकाशनो दरवाजो खोलतो સ્ક્રોલ",
        history: "થાંકા સૂતી કે રેશમ પર બૌદ્ધ સ્ક્રોલ ચિત્રો છે. ભક્તિ, ધ્યાન અને ધાર્મિક શિકೞનની વસ્તુ તરીકે બનાવધામાં આવે છે.",
        community: "સિક્કિમ, લદાખ, ધર્મશાળા અને સ્પિતિમાં તિબેતી બૌદ્ધ ભિક્ષુઓ અને ગૃહસ્થ કળાકારો."
      },
      mr: {
        tagline: "बोधप्राप्तीचे दालन उघडणारी एक गुंडाळी",
        history: "थंका हे सूती किंवा रेशमावर बौद्ध स्क्रोल चित्रे आहेत, जी भक्ती, ध्यान आणि धार्मिक शिक्षणाची वस्तू म्हणून तयार केली जातात. प्रत्येक घटक — आकृती, मुद्रा, रंग आणि प्रतीक — प्राचीन प्रतिमालेखन ग्रंथांद्वारे अचूकपणे ठरवलेला आहे.",
        community: "सिक्किम, लडाख, धर्मशाला आणि स्पितीमधील तिबेटी बौद्ध भिक्षू आणि गृहस्थ कलाकार. प्रशिक्षण मठात होते आणि प्रावीण्य मिळवण्यास ५-१० वर्षे लागतात.",
        materials: ["सूती किंवा रेशमी कॅनव्हास", "खनिज रंगद्रव्ये — मॅलाकाइट, लॅपिस लॅझुली, सिनाबार", "सोन्याची पूड", "प्राण्यांच्या कातड्याचा गोंद"],
        tools: ["बारीक खारीच्या केसांचे ब्रश", "भौमितिक मंडलासाठी कंपास आणि रूलर", "सोने पॉलिश करण्याची साधने"]
      }
    }
  },

  "Kolam of Tamil Nadu": {
    name: "Kolam",
    region: "Tamil Nadu",
    coords: [11.1, 78.7],
    tagline: "A daily prayer drawn at the threshold of dawn",
    history: "Kolam is a living ritual art practised every morning by millions of women across Tamil Nadu, Kerala, Karnataka, and Andhra Pradesh. At dawn, the threshold of the home is swept clean and the Kolam is drawn freehand in rice powder — an offering of food to insects and birds, a gesture of ahimsa (non-harm) at the start of each day. The intricate geometric patterns are drawn by placing dots in a grid and looping continuous lines around them. Patterns vary by region, occasion, and family tradition.",
    materials: ["Rice flour or powder", "White powdered limestone", "Coloured chalk powders", "Flower petals for festival Kolams"],
    tools: ["Fingers and thumb", "Dry powder pinched and trailed between thumb and forefinger"],
    community: "Practised by women across all communities in Tamil Nadu and neighbouring states. Patterns are passed from mother to daughter from early childhood.",
    translations: {
      hi: {
        tagline: "भोर की दहलीज पर खींची जाने वाली दैनिक प्रार्थना",
        history: "कोलम तमिलनाडु, केरल, कर्नाटक और आंध्र प्रदेश में लाखों महिलाओं द्वारा प्रतिदिन सुबह की जाने वाली एक जीवित अनुष्ठान कला है। भोर में घर की दहलीज साफ की जाती है और कोलम चावल के पाउडर से बनाया जाता है — कीड़ों और पक्षियों के लिए भोजन का अर्पण, दिन की शुरुआत में अहिंसा का एक इशारा।",
        community: "तमिलनाडु और पड़ोसी राज्यों में सभी समुदायों की महिलाओं द्वारा प्रचलित। बचपन से ही माँ से बेटी को पैटर्न दिए जाते हैं।",
        materials: ["चावल का आटा या पाउडर", "सफेद चूना पत्थर पाउडर", "रंगीन चॉक पाउडर", "त्योहारी कोलम के लिए फूलों की पंखुड़ियाँ"],
        tools: ["उंगलियाँ और अंगूठा", "अंगूठे और तर्जनी के बीच सूखा पाउडर"]
      },
      bn: {
        tagline: "ভোরের দোরগোড়ায় আঁকা দৈনিক প্রার্থনা",
        history: "কোলাম তামিলনাড়ু, কেরালা, কর্ণাটক এবং অন্ধ্রপ্রদেশে লক্ষ লক্ষ মহিলা প্রতিদিন সকালে পালন করা একটি জীবন্ত আচার-অনুষ্ঠান শিল্প। ভোরে বাড়ির দোরগোড়া ঝাড়ু দিয়ে পরিষ্কার করা হয় এবং কোলাম চালের গুঁড়ো দিয়ে আঁকা হয়।",
        community: "তামিলনাড়ু ও প্রতিবেশী রাজ্যের সকল সম্প্রদায়ের মহিলারা। ছোটবেলা থেকে মায়ের কাছ থেকে মেয়েকে নকশা শেখানো হয়।",
        materials: ["চালের আটা বা গুঁড়ো", "সাদা চুনাপাথর গুঁড়ো", "রঙিন চক গুঁড়ো", "উৎসবের কোলামের জন্য ফুলের পাপড়ি"],
        tools: ["আঙুল ও বুড়ো আঙুল", "বুড়ো আঙুল ও তর্জনীর মাঝে শুকনো গুঁড়ো"]
      },
      ta: {
        tagline: "விடியல் வாசலில் வரையப்படும் தினசரி வழிபாடு",
        history: "கோலம் தமிழ்நாடு, கேரளா, கர்நாடகா மற்றும் ஆந்திரப்பிரதேசம் முழுவதும் மில்லியன் கணக்கான பெண்களால் தினமும் காலையில் வரையப்படும் ஒரு வாழும் சடங்கு கலை. விடியலில் வீட்டின் வாசல் சுத்தம் செய்யப்பட்டு கோலம் அரிசி மாவில் வரையப்படுகிறது — பூச்சிகளுக்கும் பறவைகளுக்கும் உணவு அர்ப்பணம், அஹிம்சையின் சைகை.",
        community: "தமிழ்நாடு மற்றும் அருகில் உள்ள மாநிலங்களில் அனைத்து சமூகங்களிலும் உள்ள பெண்களால் கடைப்பிடிக்கப்படுகிறது. குழந்தை பருவத்திலிருந்தே தாயிடமிருந்து மகளுக்கு வடிவங்கள் கற்றுக்கொடுக்கப்படுகின்றன.",
        materials: ["அரிசி மாவு அல்லது தூள்", "வெள்ளை சுண்ணாம்புக்கல் தூள்", "வண்ண சாக் தூள்", "திருவிழா கோலத்திற்கு மலர் இதழ்கள்"],
        tools: ["விரல்கள் மற்றும் கட்டை விரல்", "கட்டை விரல் மற்றும் ஆள் காட்டி விரலுக்கிடையே உலர்ந்த தூள்"]
      },
      gu: {
        tagline: "\u0AAD\u0ACB\u0BB0\u0AA8\u0AC0 \u0AA6\u0AB0\u0AB5\u0ABE\u0A9C\u0AC7 \u0A86\u0A82\u0A95\u0AB5\u0ABE\u0AAE\u0ABE\u0A82 \u0A86\u0AB5\u0AA4\u0AC0 \u0AB0\u0ACB\u0A9C\u0AA8\u0ABF \u0AAA\u0ACD\u0AB0\u0ABE\u0AB0\u0ACD\u0AA5\u0AA8\u0ABE",
        history: "\u0A95\u0ACB\u0AB2\u0AAE \u0AA4\u0AAE\u0ABF\u0AB2\u0AA8\u0ABE\u0AA1\u0AC1, \u0A95\u0AC7\u0AB0\u0AB3, \u0A95\u0AB0\u0ACD\u0AA3\u0ABE\u0A9F\u0A95 \u0A85\u0AA8\u0AC7 \u0A86\u0A82\u0AA7\u0ACD\u0AB0\u0AAA\u0ACD\u0AB0\u0AA6\u0AC7\u0AB6\u0AAE\u0ABE\u0A82 \u0AB2\u0ABE\u0A96\u0ACB \u0AB8\u0ACD\u0AA4\u0ACD\u0AB0\u0AC0\u0A93 \u0AA6\u0ACD\u0AB5\u0ABE\u0AB0\u0ABE \u0AA6\u0AB0\u0AB0\u0ACB\u0A9C \u0AB8\u0AB5\u0ABE\u0AB0\u0AC7 \u0A95\u0AB0\u0AB5\u0ABE\u0AAE\u0ABE\u0A82 \u0A86\u0AB5\u0AA4\u0AC0 \u0A9C\u0AC0\u0AB5\u0AA8\u0ACD\u0AA4 \u0AB5\u0ABF\u0AA7\u0ABF \u0A95\u0AB3\u0ABE \u0A9B\u0AC7. \u0AAD\u0ACB\u0BB0\u0AB5\u0AC7\u0AB3\u0ABE\u0A8F \u0AB0\u0ABE\u0A82\u0A97\u0AC0\u0AB2\u0AC0 \u0AA6\u0AB0\u0AB5\u0ABE\u0A9C\u0ABE\u0AA8\u0AC0 \u0A86\u0A97\u0AB3 \u0AB8\u0ABE\u0AAB \u0A95\u0AB0\u0ABF \u0A9A\u0ACB\u0A96\u0AAE\u0ABE\u0A82\u0AA5\u0AC0 \u0A95\u0ACB\u0AB2\u0AAE \u0AAC\u0AA8\u0ABE\u0AB5\u0AAE\u0ABE\u0A82 \u0A86\u0AB5\u0AC7 \u0A9B\u0AC7.",
        community: "\u0AA4\u0AAE\u0ABF\u0AB2\u0AA8\u0ABE\u0AA1\u0AC1 \u0A85\u0AA8\u0AC7 \u0AAA\u0AA1\u0ACB\u0AB6\u0AC0 \u0AB0\u0ABE\u0A9C\u0ACD\u0AAF\u0ACB\u0AAE\u0ABE\u0A82 \u0AA4\u0AAE\u0ABE\u0AAE \u0AB8\u0AAE\u0AC1\u0AA6\u0ABE\u0AAF\u0ACB\u0AA8\u0AC0 \u0AB8\u0ACD\u0AA4\u0ACD\u0AB0\u0AC0\u0A93 \u0AA6\u0ACD\u0AB5\u0ABE\u0AB0\u0ABE \u0A86\u0A9A\u0AB0\u0AA3\u0AAE\u0ABE\u0A82 \u0A86\u0AB5\u0AC7 \u0A9B\u0AC7."
      },
      mr: {
        tagline: "पहाटेच्या उंबरठ्यावर रेखाटलेली दैनिक प्रार्थना",
        history: "कोलम ही तमिळनाडू, केरळ, कर्नाटक आणि आंध्र प्रदेशमधील लाखो महिलांद्वारे दररोज सकाळी केली जाणारी एक जिवंत विधी कला आहे. पहाटे घराच्या उंबरठ्याची साफसफाई करून तांदळाच्या पिठाने कोलम काढले जाते — कीटक आणि पक्ष्यांसाठी अन्न अर्पण, अहिंसेची एक कृती.",
        community: "तमिळनाडू आणि शेजारील राज्यांतील सर्व समाजांतील महिला. बालपणापासूनच आईकडून मुलीला नमुने शिकवले जातात.",
        materials: ["तांदळाचे पीठ किंवा पावडर", "पांढरा चुनखडीचा पाउडर", "रंगीत खडूची पावडर", "उत्सवी कोलमसाठी फुलांच्या पाकळ्या"],
        tools: ["बोटे आणि अंगठा", "अंगठा आणि तर्जनी यांच्यामध्ये धरलेली कोरडी पावडर"]
      }
    }
  },

  "Talpatra Chittar of Odisha": {
    name: "Talpatra Chittara",
    region: "Odisha",
    coords: [20.0, 85.8],
    tagline: "Stories engraved on leaves of time",
    history: "Talpatra Chittara is the ancient art of illustrating palm leaf manuscripts, practised in Odisha for over a thousand years. Dried palm leaves are cut into uniform strips and engraved with a pointed metal stylus; lampblack or charcoal ink is then rubbed across the surface and settles into the cuts, revealing the image when wiped clean. The Chitrakara caste created entire illustrated manuscripts of the Ramayana, Mahabharata, Gita Govinda, and Odishan folklore.",
    materials: ["Dried palm leaves (tala patra)", "Lampblack or charcoal ink", "Turmeric solution for preservation"],
    tools: ["Metal stylus (iron writing pen)", "Smooth polishing stone"],
    community: "The Chitrakara caste of painters in Puri district and Raghurajpur heritage village, Odisha, where nearly every family continues the tradition.",
    translations: {
      hi: {
        tagline: "समय की पत्तियों पर उकेरी गई कहानियाँ",
        history: "ताल पत्र चित्तार ओडिशा में एक हजार से अधिक वर्षों से प्रचलित ताड़ के पत्तों की पांडुलिपियों को चित्रित करने की प्राचीन कला है। सूखे ताड़ के पत्तों को समान पट्टियों में काटकर नुकीले धातु की कलम से उकेरा जाता है; फिर लैम्पब्लैक या चारकोल स्याही लगाई जाती है।",
        community: "ओडिशा के पुरी जिले और रघुराजपुर विरासत गाँव के चित्रकार जाति के चित्रकार, जहाँ लगभग हर परिवार इस परंपरा को जारी रखता है।",
        materials: ["सूखे ताड़ के पत्ते (ताल पत्र)", "लैम्पब्लैक या चारकोल स्याही", "संरक्षण के लिए हल्दी का घोल"],
        tools: ["धातु की कलम (लोहे की लेखनी)", "चिकनी पॉलिश पत्थर"]
      },
      bn: {
        tagline: "সময়ের পাতায় খোদাই করা গল্প",
        history: "তালপত্র চিত্তারা ওড়িশায় হাজার বছরেরও বেশি সময় ধরে প্রচলিত তালপাতার পাণ্ডুলিপি চিত্রণের প্রাচীন শিল্প। শুকনো তালপাতা সমান পট্টিতে কেটে ধারালো ধাতব কলম দিয়ে খোদাই করা হয়।",
        community: "ওড়িশার পুরী জেলা ও রঘুরাজপুর ঐতিহ্যবাহী গ্রামের চিত্রকর জাতির চিত্রশিল্পীরা, যেখানে প্রায় প্রতিটি পরিবার এই ঐতিহ্য অব্যাহত রাখে।",
        materials: ["শুকনো তালপাতা (তাল পত্র)", "লার্মব্ল্যাক বা কাঠকয়লা কালি", "সংরক্ষণের জন্য হলুদ দ্রবণ"],
        tools: ["ধাতব স্টাইলাস (লোহার লেখার কলম)", "মসৃণ পালিশ পাথর"]
      },
      ta: {
        tagline: "காலத்தின் இலைகளில் பொறிக்கப்பட்ட கதைகள்",
        history: "தால்பத்ரா சித்தாரா என்பது ஒடிசாவில் ஆயிரம் ஆண்டுகளுக்கும் மேலாக கடைப்பிடிக்கப்படும் பனை இலை கைப்பட்டியம் வரைதல் கலை. உலர்ந்த பனை இலைகளை சீரான பட்டைகளாக வெட்டி கூர்மையான உலோக எழுத்தாணியால் பொறிக்கப்படுகின்றன.",
        community: "ஒடிசாவின் புரி மாவட்டம் மற்றும் ரகுராஜ்பூர் பாரம்பரிய கிராமத்தின் சித்திரகர் சாதி ஓவியர்கள், அங்கு கிட்டத்தட்ட ஒவ்வொரு குடும்பமும் இந்த மரபை தொடர்கிறது.",
        materials: ["உலர்ந்த பனை இலைகள் (தால பத்ரா)", "இலாம்ப் கருப்பு அல்லது கரி மை", "பாதுகாப்புக்கு மஞ்சள் கரைசல்"],
        tools: ["உலோக எழுத்தாணி (இரும்பு எழுதும் பேனா)", "மென்மையான மெருகு கல்"]
      },
      gu: {
        tagline: "\u0AB8\u0AAE\u0AAF\u0AA8\u0ABE \u0AAA\u0ABE\u0AA8 \u0AAA\u0AB0 \u0A95\u0ACB\u0AA4\u0AB0\u0AC7\u0AB2\u0AC0 \u0A95\u0AA5\u0ABE\u0A93",
        history: "\u0AA4\u0ABE\u0AB2\u0AAA\u0AA4\u0ACD\u0AB0 \u0A9A\u0ABF\u0AA4\u0ACD\u0AA4\u0ABE\u0AB0\u0ABE \u0A93\u0AA1\u0ABF\u0AB6\u0ABE\u0AAE\u0ABE\u0A82 \u0AB9\u0A9C\u0ABE\u0AB0 \u0AB5\u0AB0\u0ACD\u0AB7\u0AA5\u0AC0 \u0AA7\u0ABF\u0A95 \u0AB5\u0B2F\u0AA5\u0AC0 \u0AAA\u0ACD\u0AB0\u0A9A\u0AB2\u0ABF\u0AA4 \u0AA4\u0ABE\u0AA1\u0AA8\u0ABE \u0AAA\u0ABE\u0A82\u0AA6\u0AA1\u0ABE\u0AA8\u0AC0 \u0AAA\u0ACD\u0AB0\u0ABE\u0A9A\u0AC0\u0AA8 \u0A9A\u0ABF\u0AA4\u0ACD\u0AB0\u0A95\u0AB3\u0ABE \u0A9B\u0AC7.",
        community: "\u0A93\u0AA1\u0ABF\u0AB6\u0ABE\u0AA8\u0ABE \u0AAA\u0AC1\u0AB0\u0AC0 \u0A9C\u0ABF\u0AB2\u0ACD\u0AB2\u0ABE \u0A85\u0AA8\u0AC7 \u0AB0\u0AC1\u0AB0\u0ABE\u0A9C\u0AAA\u0AC1\u0AB0 \u0A97\u0ABE\u0AAE\u0AA8\u0ABE \u0A9A\u0ABF\u0AA4\u0ACD\u0AB0\u0A95\u0ABE\u0AB0 \u0A9C\u0A93\u0AA4\u0ABF\u0AA8\u0ABE \u0A9A\u0ABF\u0AA4\u0ACD\u0AB0\u0A95\u0ABE\u0AB0\u0ACB."
      },
      mr: {
        tagline: "काळाच्या पानांवर कोरलेल्या कथा",
        history: "तालपत्र चित्तार ही ओडिशामध्ये हजारपेक्षा जास्त वर्षांपासून प्रचलित असलेली ताडाच्या पानांच्या हस्तलिखितांना चित्रित करण्याची प्राचीन कला आहे. वाळलेली ताडाची पाने समान पट्ट्यांमध्ये कापून धारदार धातूच्या लेखणीने कोरली जातात.",
        community: "ओडिशाच्या पुरी जिल्हा आणि रघुराजपूर वारसा गावातील चित्रकार जातीचे चित्रकार, जिथे जवळजवळ प्रत्येक कुटुंब ही परंपरा जोपासत आहे.",
        materials: ["वाळलेली ताडाची पाने (ताल पत्र)", "दिव्याची काजळी किंवा कोळशाची शाई", "संरक्षणासाठी हळदीचे द्रावण"],
        tools: ["धातूची लेखणी (लोखंडी लिखाण कलम)", "गुळगुळीत पॉलिश दगड"]
      }
    }
  },

  "Aipan Art of Uttrakhand": {
    name: "Aipan",
    region: "Uttarakhand",
    coords: [29.6, 79.6],
    tagline: "Sacred geometry from the Himalayan foothills",
    history: "Aipan is a ritual floor and wall art form of the Kumaon region of Uttarakhand, drawn by women during festivals, births, weddings, and worship ceremonies. The background is prepared with a wash of red clay (geru), onto which intricate white patterns are drawn in rice paste using the ring finger. Each design corresponds to a specific deity or occasion: the Shiva Panchayatan for Shiva worship, the Saptmatrika design for birth ceremonies, and Lakshmi's feet for prosperity rituals. Aipan is ephemeral by nature — made to mark a sacred moment and washed away by rain and time.",
    materials: ["Red clay (geru)", "White rice paste (pithya)", "Walls and floors of homes"],
    tools: ["Ring finger of the right hand", "Cloth wick soaked in rice paste"],
    community: "Kumaoni Brahmin women of the Almora, Pithoragarh, and Nainital districts of Uttarakhand. Patterns are memorised and passed through female lineage.",
    translations: {
      hi: {
        tagline: "हिमालय की तलहटी से पवित्र ज्यामिति",
        history: "ऐपण उत्तराखंड के कुमाऊँ क्षेत्र की एक अनुष्ठानिक फर्श और दीवार कला है, जिसे महिलाएँ त्योहारों, जन्म, विवाह और पूजा समारोहों के दौरान बनाती हैं। पृष्ठभूमि लाल मिट्टी (गेरू) से तैयार की जाती है, जिस पर अनामिका से चावल का लेप डालकर जटिल सफेद पैटर्न बनाए जाते हैं। ऐपण क्षणिक प्रकृति का है — एक पवित्र क्षण को चिह्नित करने के लिए बनाया जाता है और बारिश से धुल जाता है।",
        community: "उत्तराखंड के अल्मोड़ा, पिथौरागढ़ और नैनीताल जिलों की कुमाऊँनी ब्राह्मण महिलाएँ। पैटर्न महिला वंशावली के माध्यम से पारित होते हैं।",
        materials: ["लाल मिट्टी (गेरू)", "सफेद चावल का लेप (पित्या)", "घरों की दीवारें और फर्श"],
        tools: ["दाहिने हाथ की अनामिका", "चावल के लेप में भिगोई कपड़े की बाती"]
      },
      bn: {
        tagline: "হিমালয়ের পাদদেশ থেকে পবিত্র জ্যামিতি",
        history: "আইপান উত্তরাখণ্ডের কুমায়ুন অঞ্চলের একটি আচার-অনুষ্ঠান মেঝে ও দেওয়াল শিল্প, যা মহিলারা উৎসব, জন্ম, বিবাহ এবং পূজা অনুষ্ঠানে তৈরি করেন। পটভূমি লাল মাটি (গেরু) দিয়ে তৈরি করা হয়, যার উপর অনামিকা আঙুল দিয়ে চালের পেস্টে জটিল সাদা নকশা আঁকা হয়।",
        community: "উত্তরাখণ্ডের আলমোড়া, পিথোরাগড় এবং নৈনিতাল জেলার কুমায়ুনি ব্রাহ্মণ মহিলারা। নকশা মহিলা বংশপরম্পরায় হস্তান্তরিত হয়।",
        materials: ["লাল মাটি (গেরু)", "সাদা চালের পেস্ট (পিথ্যা)", "বাড়ির দেওয়াল ও মেঝে"],
        tools: ["ডান হাতের অনামিকা", "চালের পেস্টে ভেজানো কাপড়ের সলতে"]
      },
      ta: {
        tagline: "இமயமலை அடிவாரத்தின் புனித வடிவியல்",
        history: "ஐபான் என்பது உத்தராகண்டின் குமாவோன் பகுதியின் ஒரு சடங்கு தரை மற்றும் சுவர் கலை, திருவிழாக்கள், பிறப்புகள், திருமணங்கள் மற்றும் வழிபாட்டு நிகழ்வுகளின்போது பெண்களால் வரையப்படுகிறது. சிவப்பு களிமண் (கேரு) பின்னணியில் மோதிர விரலால் அரிசி விழுதில் சிக்கலான வெள்ளை வடிவங்கள் வரையப்படுகின்றன.",
        community: "உத்தராகண்டின் அல்மோரா, பித்தோராகர் மற்றும் நைனிடால் மாவட்டங்களின் குமாவோனி பிராமண பெண்கள். வடிவங்கள் பெண் வழி மரபில் கடத்தப்படுகின்றன.",
        materials: ["சிவப்பு களிமண் (கேரு)", "வெள்ளை அரிசி விழுது (பித்யா)", "வீடுகளின் சுவர்கள் மற்றும் தரைகள்"],
        tools: ["வலது கையின் மோதிர விரல்", "அரிசி விழுதில் நனைத்த துணி திரி"]
      },
      gu: {
        tagline: "\u0AB9\u0ABF\u0AAE\u0ABE\u0AB2\u0AAF\u0AA8\u0AC0 \u0AA4\u0AB3\u0AB9\u0A9F\u0AC0\u0AA5\u0AC0 \u0AAA\u0AB5\u0ABF\u0AA4\u0ACD\u0AB0 \u0AAD\u0AC2\u0AAE\u0ABF\u0AA4\u0ABF",
        history: "\u0A90\u0AAA\u0AA3 \u0A89\u0AA4\u0ACD\u0AA4\u0AB0\u0ABE\u0A96\u0A82\u0AA1\u0AA8\u0ABE \u0A95\u0AC1\u0AAE\u0ABE\u0A93\u0AA8 \u0AA6\u0AC7\u0AB6\u0AA8\u0AC0 \u0A9A\u0ABF\u0AA4\u0ACD\u0AB0\u0A95\u0AB3\u0ABE \u0A9B\u0AC7, \u0AA4\u0AB9\u0AC7\u0AB5\u0ABE\u0AB0\u0ACB, \u0A9C\u0AA8\u0ACD\u0AAE, \u0AB2\u0A97\u0ACD\u0AA8 \u0A85\u0AA8\u0AC7 \u0AAA\u0AC2\u0A9C\u0ABE \u0AA6\u0AB0\u0AAE\u0ABF\u0AAF\u0ABE\u0AA8 \u0AB8\u0ACD\u0AA4\u0ACD\u0AB0\u0AC0\u0A93 \u0AAC\u0AA8\u0ABE\u0AB5\u0AC7 \u0A9B\u0AC7. \u0AB2\u0ABE\u0AB2 \u0AAE\u0ABE\u0AA1\u0AC0 (\u0A97\u0AC7\u0AB0\u0AC1) \u0AAA\u0AB0 \u0A85\u0AA8\u0ABE\u0AAE\u0ABF\u0A95\u0ABE \u0A86\u0A82\u0A97\u0AB3\u0AC0\u0AA5\u0AC0 \u0AB8\u0AAB\u0AC7\u0AA6 \u0A9A\u0ACB\u0A96\u0AA8\u0AC0 \u0AB2\u0AC7\u0AAA\u0AA8\u0AA5\u0AC0 \u0A9C\u0A9F\u0ABF\u0AB2 \u0AA8\u0ABE\u0A95\u0ACB \u0AA6\u0ACB\u0BB0\u0AB5\u0ABE\u0AAE\u0ABE\u0A82 \u0A86\u0AB5\u0AC7 \u0A9B\u0AC7.",
        community: "\u0A89\u0AA4\u0ACD\u0AA4\u0AB0\u0ABE\u0A96\u0A82\u0AA1\u0AA8\u0ABE \u0A85\u0AB2\u0AAE\u0ACB\u0AA1\u0ABE, \u0AAA\u0ABF\u0AA5\u0CCF\u0AB0\u0ABE\u0A97\u0AA2 \u0A85\u0AA8\u0AC7 \u0AA8\u0AF2\u0AA8\u0ABF\u0AA4\u0ABE\u0AB2 \u0A9C\u0ABF\u0AB2\u0ACD\u0AB2\u0ABE\u0A93\u0AA8\u0AC0 \u0A95\u0AC1\u0AAE\u0ABE\u0A93\u0AA8\u0AC0 \u0AAC\u0ACD\u0AB0\u0ABE\u0AB9\u0ACD\u0AAE\u0AA3 \u0AB8\u0ACD\u0AA4\u0ACD\u0AB0\u0AC0\u0A93."
      },
      mr: {
        tagline: "हिमालयाच्या पायथ्याशी पवित्र भूमिती",
        history: "ऐपण हे उत्तराखंडच्या कुमाऊँ प्रदेशाची एक विधी जमिनी आणि भिंत कला आहे, जी महिला सण, जन्म, विवाह आणि पूजा समारंभांदरम्यान काढतात. लाल माती (गेरू) ने पार्श्वभूमी तयार केली जाते, ज्यावर अनामिका बोटाने तांदळाच्या पेस्टने जटिल पांढरे नमुने काढले जातात. ऐपण क्षणिक स्वभावाचे आहे — एक पवित्र क्षण साजरा करण्यासाठी बनवले जाते आणि पावसाने धुऊन जाते.",
        community: "उत्तराखंडच्या अल्मोडा, पिथौरागड आणि नैनिताल जिल्ह्यांतील कुमाऊँनी ब्राह्मण महिला. नमुने स्त्री वंशावळीतून दिले जातात.",
        materials: ["लाल माती (गेरू)", "पांढरी तांदळाची पेस्ट (पित्या)", "घरांच्या भिंती आणि जमिनी"],
        tools: ["उजव्या हाताची अनामिका", "तांदळाच्या पेस्टमध्ये भिजवलेली कापडाची वात"]
      }
    }
  }

};