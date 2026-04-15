// ─────────────────────────────────────────────────────────
//  Noor App — Islamic Content Data
//  Each card: category, arabic, translation, explanation
//  (≤60 words), source, color accent
// ─────────────────────────────────────────────────────────

export const CATEGORIES = ['All', 'Ayah', 'Hadith', 'Story', 'Dua'];

export const CATEGORY_COLORS = {
  Ayah:   '#1B5E20',   // Deep green
  Hadith: '#1A237E',   // Deep blue
  Story:  '#4A148C',   // Deep purple
  Dua:    '#B71C1C',   // Deep red
};

export const CATEGORY_LIGHT = {
  Ayah:   '#E8F5E9',
  Hadith: '#E8EAF6',
  Story:  '#F3E5F5',
  Dua:    '#FFEBEE',
};

export const content = [

  // ══════════════════ AYAHS ══════════════════

  {
    id: 'ayah_1_1',
    category: 'Ayah',
    arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
    translation: '"In the name of Allah, the Most Gracious, the Most Merciful."',
    explanation:
      'Every deed of significance begins with Bismillah. The Prophet ﷺ said: "Every important matter not beginning with Bismillah is cut off from blessings." Start your day, meals, and every action with this powerful invocation to invite Allah\'s blessing.',
    source: 'Surah Al-Fatihah • 1:1',
    sourceType: 'Quran',
    tag: 'Bismillah',
  },
  {
    id: 'ayah_2_255',
    category: 'Ayah',
    arabic: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ',
    translation: '"Allah — there is no deity except Him, the Ever-Living, the Sustainer of existence."',
    explanation:
      'Ayatul Kursi is the greatest verse in the Quran. Reciting it after every prayer grants Allah\'s protection until the next prayer. It affirms His absolute sovereignty over all creation — nothing happens except by His permission.',
    source: 'Surah Al-Baqarah • 2:255',
    sourceType: 'Quran',
    tag: 'Ayatul Kursi',
  },
  {
    id: 'ayah_2_286',
    category: 'Ayah',
    arabic: 'لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا',
    translation: '"Allah does not burden a soul beyond what it can bear."',
    explanation:
      'When life feels overwhelming, remember — Allah knows your limits better than you do. Every trial you face is within your capacity to handle. You were not given this difficulty by accident; you were chosen for it because you are strong enough.',
    source: 'Surah Al-Baqarah • 2:286',
    sourceType: 'Quran',
    tag: 'Tawakkul',
  },
  {
    id: 'ayah_17_23',
    category: 'Ayah',
    arabic: 'وَقَضَىٰ رَبُّكَ أَلَّا تَعْبُدُوا إِلَّا إِيَّاهُ وَبِالْوَالِدَيْنِ إِحْسَانًا',
    translation: '"Your Lord has decreed that you worship none but Him, and show kindness to your parents."',
    explanation:
      'Kindness to parents is placed immediately after worshipping Allah — showing its immense importance. Even a sigh of frustration toward them is forbidden. The Prophet ﷺ said: "Paradise lies beneath the feet of mothers." Honour them while you still can.',
    source: 'Surah Al-Isra • 17:23',
    sourceType: 'Quran',
    tag: 'Parents',
  },
  {
    id: 'ayah_94_5',
    category: 'Ayah',
    arabic: 'فَإِنَّ مَعَ الْعُسْرِ يُسْرًا ۝ إِنَّ مَعَ الْعُسْرِ يُسْرًا',
    translation: '"For indeed, with hardship will be ease. Indeed, with hardship will be ease."',
    explanation:
      'Allah repeated this promise twice in the same surah. Scholars note that "hardship" is definite (one) while "ease" is indefinite — meaning one hardship brings multiple forms of relief. Difficulty never comes alone; ease is always in its shadow.',
    source: 'Surah Al-Inshirah • 94:5–6',
    sourceType: 'Quran',
    tag: 'Hope',
  },
  {
    id: 'ayah_103_1',
    category: 'Ayah',
    arabic: 'وَالْعَصْرِ ۝ إِنَّ الْإِنسَانَ لَفِي خُسْرٍ',
    translation: '"By time — indeed, mankind is in loss, except those who believe, do good, and counsel truth and patience."',
    explanation:
      'Imam Shafi\'i said: "If people only reflected on this surah, it would suffice them." Time is your most precious asset. Every moment not in faith, good deeds, or beneficial action is a loss. The question is: what will you do with what remains?',
    source: 'Surah Al-Asr • 103:1–3',
    sourceType: 'Quran',
    tag: 'Time',
  },
  {
    id: 'ayah_2_156',
    category: 'Ayah',
    arabic: 'إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ',
    translation: '"Indeed, we belong to Allah, and indeed to Him we shall return."',
    explanation:
      'These words, spoken in times of loss, realign the heart. Everything we own — wealth, family, health — is a trust from Allah. Our return to Him is certain. Say this not only at death, but for every loss: a broken phone, a missed opportunity, a fading friendship.',
    source: 'Surah Al-Baqarah • 2:156',
    sourceType: 'Quran',
    tag: 'Patience',
  },
  {
    id: 'ayah_8_45',
    category: 'Ayah',
    arabic: 'وَاذْكُرُوا اللَّهَ كَثِيرًا لَّعَلَّكُمْ تُفْلِحُونَ',
    translation: '"And remember Allah often so that you may succeed."',
    explanation:
      'Dhikr — remembrance of Allah — is the lifeline of the believer\'s heart. The Prophet ﷺ said: "The parable of the one who remembers Allah versus the one who doesn\'t is like the living versus the dead." Keep your tongue moist with His remembrance.',
    source: 'Surah Al-Anfal • 8:45',
    sourceType: 'Quran',
    tag: 'Dhikr',
  },
  {
    id: 'ayah_65_2',
    category: 'Ayah',
    arabic: 'وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا ۝ وَيَرْزُقْهُ مِنْ حَيْثُ لَا يَحْتَسِبُ',
    translation: '"Whoever fears Allah, He will make a way out for them and provide from where they never expected."',
    explanation:
      'Taqwa is the ultimate life strategy. When you make Allah your priority — in honesty, worship, and character — He handles what you cannot. Provision comes from unexpected places. Problems find unexpected solutions. Trust Him.',
    source: 'Surah At-Talaq • 65:2–3',
    sourceType: 'Quran',
    tag: 'Taqwa',
  },

  // ══════════════════ HADITHS ══════════════════

  {
    id: 'hadith_bukhari_1',
    category: 'Hadith',
    arabic: 'إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ',
    translation: '"Actions are judged only by intentions."',
    explanation:
      'Your niyyah transforms ordinary acts into worship. Eating to gain strength for prayer, working to support family, sleeping to rest for Fajr — all become ibadah with the right intention. Renew your intention throughout the day and multiply your reward.',
    source: 'Sahih Bukhari & Muslim • Narrated by Umar ibn Al-Khattab (RA)',
    sourceType: 'Hadith',
    tag: 'Intention',
  },
  {
    id: 'hadith_tirmidhi_1956',
    category: 'Hadith',
    arabic: 'تَبَسُّمُكَ فِي وَجْهِ أَخِيكَ لَكَ صَدَقَةٌ',
    translation: '"Your smile in the face of your brother is a charity."',
    explanation:
      'Islam makes it easy to earn reward in every moment. A warm smile costs nothing but can brighten someone\'s day, strengthen bonds, and draw you closer to Allah — all at once. Sadaqah doesn\'t always require money. Sometimes it only takes a smile.',
    source: 'Jami\' At-Tirmidhi • Narrated by Abu Dharr (RA)',
    sourceType: 'Hadith',
    tag: 'Character',
  },
  {
    id: 'hadith_bukhari_13',
    category: 'Hadith',
    arabic: 'لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ',
    translation: '"None of you truly believes until he loves for his brother what he loves for himself."',
    explanation:
      'True iman produces empathy. Wishing others the goodness you desire for yourself — sharing knowledge, making du\'a for others, genuinely celebrating their blessings. This is the golden rule of Islam. Brotherhood isn\'t just a title; it\'s a feeling.',
    source: 'Sahih Bukhari • Narrated by Anas ibn Malik (RA)',
    sourceType: 'Hadith',
    tag: 'Brotherhood',
  },
  {
    id: 'hadith_tirmidhi_2501',
    category: 'Hadith',
    arabic: 'مَنْ صَمَتَ نَجَا',
    translation: '"Whoever is silent is saved."',
    explanation:
      'The tongue is both a great tool and a great danger. How many friendships destroyed, how many sins committed, by unguarded words? The Prophet ﷺ said: "Speak good or remain silent." Guard your speech, especially on social media — it guards your soul.',
    source: 'Jami\' At-Tirmidhi • Narrated by Abdullah ibn Amr (RA)',
    sourceType: 'Hadith',
    tag: 'Speech',
  },
  {
    id: 'hadith_bukhari_6406',
    category: 'Hadith',
    arabic: 'كَلِمَتَانِ خَفِيفَتَانِ عَلَى اللِّسَانِ، ثَقِيلَتَانِ فِي الْمِيزَانِ',
    translation: '"Two words light on the tongue, heavy on the scales, beloved to the Most Merciful: SubhanAllahi wa bihamdihi, SubhanAllahil Azeem."',
    explanation:
      'Glory be to Allah and His praise; Glory be to Allah the Magnificent. Two short phrases that weigh heavily on the Scale of Deeds on Judgment Day. Say them in traffic, between tasks, before sleep — wherever you are. The reward is enormous.',
    source: 'Sahih Bukhari & Muslim • Narrated by Abu Hurayrah (RA)',
    sourceType: 'Hadith',
    tag: 'Dhikr',
  },
  {
    id: 'hadith_bukhari_5027',
    category: 'Hadith',
    arabic: 'خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ',
    translation: '"The best of you are those who learn the Quran and teach it."',
    explanation:
      'You don\'t need to be a scholar. Teaching a single verse to your child or friend earns you ongoing reward — sadaqah jariyah — even after you pass away. Learning and sharing the Quran is among the highest honors a Muslim can hold.',
    source: 'Sahih Bukhari • Narrated by Uthman ibn Affan (RA)',
    sourceType: 'Hadith',
    tag: 'Quran',
  },
  {
    id: 'hadith_tirmidhi_1987',
    category: 'Hadith',
    arabic: 'اتَّقِ اللَّهَ حَيْثُمَا كُنتَ',
    translation: '"Fear Allah wherever you are, follow a bad deed with a good one to erase it, and treat people with good character."',
    explanation:
      'Taqwa is not just for the mosque — it\'s for the office, home, and marketplace. This single hadith covers your relationship with Allah, your response to mistakes, and your dealings with all of humanity. It is a complete guide to living.',
    source: 'Jami\' At-Tirmidhi • Narrated by Abu Dharr (RA)',
    sourceType: 'Hadith',
    tag: 'Taqwa',
  },
  {
    id: 'hadith_muslim_2956',
    category: 'Hadith',
    arabic: 'الدُّنْيَا سِجْنُ الْمُؤْمِنِ وَجَنَّةُ الْكَافِرِ',
    translation: '"The world is a prison for the believer and a paradise for the disbeliever."',
    explanation:
      'The believer lives with constraints — halal and haram, prayer times, fasting — while longing for true paradise. The disbeliever has no such limits and enjoys this world freely. But after death, the roles reverse eternally. Choose your paradise wisely.',
    source: 'Sahih Muslim • Narrated by Abu Hurayrah (RA)',
    sourceType: 'Hadith',
    tag: 'Dunya',
  },
  {
    id: 'hadith_muslim_2593',
    category: 'Hadith',
    arabic: 'إِنَّ اللَّهَ رَفِيقٌ يُحِبُّ الرِّفْقَ',
    translation: '"Indeed, Allah is gentle and He loves gentleness in all matters."',
    explanation:
      'In our dawah, parenting, marriages, and leadership — gentleness is the Prophetic way. The Prophet ﷺ was sent as a mercy to mankind. Harshness in conveying the truth rarely opens hearts. Wisdom and kindness are the keys.',
    source: 'Sahih Bukhari & Muslim • Narrated by Aisha (RA)',
    sourceType: 'Hadith',
    tag: 'Character',
  },
  {
    id: 'hadith_bukhari_6018',
    category: 'Hadith',
    arabic: 'مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ',
    translation: '"Whoever believes in Allah and the Last Day, let him speak good or remain silent."',
    explanation:
      'Before posting, replying, or speaking — ask: Is this good? If yes, speak. If not, stay silent. This one habit alone could transform our communities. Social media, group chats, family arguments — apply this rule everywhere.',
    source: 'Sahih Bukhari • Narrated by Abu Hurayrah (RA)',
    sourceType: 'Hadith',
    tag: 'Speech',
  },

  // ══════════════════ STORIES ══════════════════

  {
    id: 'story_tawbah_1',
    category: 'Story',
    arabic: null,
    translation: 'The Man Who Killed 99 — Tawbah Has No Limit',
    explanation:
      'A man killed 99 people and sought repentance. A scholar told him he\'d never be forgiven — he killed that scholar too (100 total). A wise man directed him to a righteous town. He died en route, and Allah forgave him — judging his sincere intention. No one is beyond Allah\'s mercy.',
    source: 'Sahih Bukhari & Muslim',
    sourceType: 'Story',
    tag: 'Repentance',
  },
  {
    id: 'story_mercy_1',
    category: 'Story',
    arabic: null,
    translation: 'The Woman and the Cat — Cruelty Has Consequences',
    explanation:
      'A woman entered Hellfire because of a cat she locked up — neither feeding it nor freeing it to eat. Islam teaches that mercy toward all living beings is worship. Cruelty to animals is not a minor matter in Allah\'s sight — every creature matters.',
    source: 'Sahih Bukhari • Narrated by Abdullah ibn Umar (RA)',
    sourceType: 'Story',
    tag: 'Mercy',
  },
  {
    id: 'story_dawah_1',
    category: 'Story',
    arabic: null,
    translation: 'The Boy Who Gave Dawah to an Entire Kingdom',
    explanation:
      'A young boy gave dawah under a tyrant king. The king tried to kill him three times but failed by Allah\'s miracle. The boy then told the king: "Say: In the name of the Lord of this boy." The king complied — and the entire crowd witnessed a miracle and embraced Islam. One sincere person can change a nation.',
    source: 'Sahih Muslim',
    sourceType: 'Story',
    tag: 'Dawah',
  },
  {
    id: 'story_sincerity_1',
    category: 'Story',
    arabic: null,
    translation: 'Three Men, One Cave, Three Pure Deeds',
    explanation:
      'Three men were trapped in a cave by a boulder. Each made du\'a recalling their most sincere deed — one\'s obedience to parents, one\'s chastity despite temptation, one\'s honesty in business. Each du\'a shifted the boulder — until they were free. Deeds done purely for Allah alone never go to waste.',
    source: 'Sahih Bukhari • Narrated by Ibn Umar (RA)',
    sourceType: 'Story',
    tag: 'Sincerity',
  },
  {
    id: 'story_musa_1',
    category: 'Story',
    arabic: null,
    translation: 'Musa and Khidr — When You Don\'t Understand Allah\'s Plan',
    explanation:
      'Musa (AS) traveled with Khidr to learn. Khidr damaged a boat, killed a boy, and built a wall for free — all seemingly wrong. Each had a hidden divine wisdom. Lesson: what appears harmful may be mercy in disguise. Trust Allah\'s plan even when you cannot see it.',
    source: 'Surah Al-Kahf • 18:60–82',
    sourceType: 'Story',
    tag: 'Trust in Allah',
  },
  {
    id: 'story_uwais_1',
    category: 'Story',
    arabic: null,
    translation: 'Uwais Al-Qarni — Unknown on Earth, Famous in Heaven',
    explanation:
      'Uwais Al-Qarni never met the Prophet ﷺ, yet the Prophet told Umar (RA): "If you meet him, ask him to make du\'a for you." Why? He shaved his head to cure his leprosy out of gratitude, and devoted his life to his mother. Allah can make you great through hidden deeds and hidden sincerity.',
    source: 'Sahih Muslim',
    sourceType: 'Story',
    tag: 'Sincerity',
  },
  {
    id: 'story_mercy_2',
    category: 'Story',
    arabic: null,
    translation: 'A Prostitute and a Thirsty Dog — The Power of Mercy',
    explanation:
      'A woman of ill repute saw a thirsty dog panting by a well. She removed her shoe, filled it with water, and gave the dog a drink. Allah forgave all her sins because of that one act of mercy. Never underestimate a single good deed done with a sincere heart.',
    source: 'Sahih Bukhari & Muslim • Narrated by Abu Hurayrah (RA)',
    sourceType: 'Story',
    tag: 'Mercy',
  },

  // ══════════════════ DUAS ══════════════════

  {
    id: 'dua_anxiety_1',
    category: 'Dua',
    arabic: 'رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي',
    translation: '"My Lord, expand for me my chest and ease for me my task."',
    explanation:
      'The du\'a of Prophet Musa (AS) before speaking to Pharaoh. Recite this when facing anxiety, a difficult conversation, public speaking, or any overwhelming situation. Ask Allah to open your heart and smooth your path — He answered Musa, He will answer you.',
    source: 'Surah Ta-Ha • 20:25–26',
    sourceType: 'Dua',
    tag: 'Anxiety',
  },
  {
    id: 'dua_daily_1',
    category: 'Dua',
    arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ',
    translation: '"O Allah, I ask You for pardon and well-being."',
    explanation:
      'The Prophet ﷺ said after the Shahadah, no du\'a is better than asking for \'afw and \'aafiyah — forgiveness and wholeness. It covers your deen, dunya, family, and health in one breath. Simple, powerful, and the du\'a the Prophet ﷺ never abandoned.',
    source: 'Jami\' At-Tirmidhi • Narrated by Ibn Umar (RA)',
    sourceType: 'Dua',
    tag: 'Daily',
  },
  {
    id: 'dua_forgiveness_1',
    category: 'Dua',
    arabic: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ خَلَقْتَنِي وَأَنَا عَبْدُكَ',
    translation: '"O Allah, You are my Lord. There is no deity but You. You created me and I am Your servant."',
    explanation:
      'This is Sayyidul Istighfar — the Master of Seeking Forgiveness. The Prophet ﷺ said: whoever says this in the morning with certainty and dies before evening enters Jannah. Whoever says it in the evening and dies before morning enters Jannah.',
    source: 'Sahih Bukhari • Narrated by Shaddad ibn Aws (RA)',
    sourceType: 'Dua',
    tag: 'Forgiveness',
  },
  {
    id: 'dua_morning_1',
    category: 'Dua',
    arabic: 'بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
    translation: '"In the name of Allah, I place my trust in Allah, and there is no power or might except with Allah."',
    explanation:
      'Say this when leaving your home. The Prophet ﷺ said: "Whoever says this will be told: You are guided, protected, and cared for." Shaytaan will stay away from them that day. One simple habit, morning by morning, builds an invisible fortress.',
    source: 'Abu Dawud & Tirmidhi',
    sourceType: 'Dua',
    tag: 'Morning',
  },
  {
    id: 'dua_essential_1',
    category: 'Dua',
    arabic: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
    translation: '"Our Lord, give us good in this world and good in the Hereafter, and protect us from the punishment of the Fire."',
    explanation:
      'The Prophet ﷺ recited this du\'a more than any other. It covers everything: health, sustenance, family, guidance in this life — and mercy and paradise in the next. If you only learned one comprehensive du\'a, let it be this one.',
    source: 'Sahih Bukhari • Narrated by Anas ibn Malik (RA)',
    sourceType: 'Dua',
    tag: 'Essential',
  },
  {
    id: 'dua_salah_1',
    category: 'Dua',
    arabic: 'اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ',
    translation: '"O Allah, help me to remember You, to be grateful to You, and to worship You in an excellent manner."',
    explanation:
      'The Prophet ﷺ taught Mu\'adh ibn Jabal (RA) to say this after every prayer. It requests the three pillars of a strong relationship with Allah: dhikr, shukr, and quality ibadah. Make it your after-salah ritual.',
    source: 'Abu Dawud • Narrated by Mu\'adh ibn Jabal (RA)',
    sourceType: 'Dua',
    tag: 'After Salah',
  },
  {
    id: 'dua_trust_1',
    category: 'Dua',
    arabic: 'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ',
    translation: '"Allah is sufficient for us, and He is the best Disposer of affairs."',
    explanation:
      'Ibrahim (AS) said this when thrown into fire — Allah made it cool. The Prophet ﷺ and companions said it facing a massive enemy army — they returned victorious. Say it in every difficulty. Watch how Allah handles what you cannot.',
    source: 'Surah Al-Imran • 3:173',
    sourceType: 'Dua',
    tag: 'Trust',
  },
  {
    id: 'dua_anxiety_2',
    category: 'Dua',
    arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ',
    translation: '"O Allah, I seek refuge in You from worry and grief, helplessness and laziness, cowardice and miserliness, and from the burden of debt and the oppression of people."',
    explanation:
      'The Prophet ﷺ taught this du\'a as a cure for anxiety and sadness. It covers every weight the heart carries: emotional, spiritual, financial, and social. Recite it in difficult times and trust that Allah responds to the sincere call.',
    source: 'Sahih Bukhari • Narrated by Anas ibn Malik (RA)',
    sourceType: 'Dua',
    tag: 'Anxiety',
  },

  { id: 'ayah_3_139', category: 'Ayah', arabic: 'وَلَا تَهِنُوا وَلَا تَحْزَنُوا وَأَنتُمُ الْأَعْلَوْنَ إِن كُنتُم مُّؤْمِنِينَ', translation: '"Do not weaken, do not grieve — you will be superior if you are true believers."', explanation: "Revealed after the Battle of Uhud when Muslims suffered losses. Grief is human but despair is not the believer's portion. Faith is the highest ground — no worldly defeat can touch the one whose heart is anchored in Allah.", source: "Surah Ali 'Imran • 3:139", sourceType: 'Quran', tag: 'Strength of Faith' },
  { id: 'ayah_3_185', category: 'Ayah', arabic: 'كُلُّ نَفْسٍ ذَائِقَةُ الْمَوْتِ', translation: '"Every soul shall taste death."', explanation: 'Three words that contain all of philosophy. Death is the great equalizer. The believer uses this not as a source of despair but as a constant reminder to prioritize what lasts over what fades.', source: "Surah Ali 'Imran • 3:185", sourceType: 'Quran', tag: 'Death & Hereafter' },
  { id: 'ayah_4_36', category: 'Ayah', arabic: 'وَاعْبُدُوا اللَّهَ وَلَا تُشْرِكُوا بِهِ شَيْئًا ۖ وَبِالْوَالِدَيْنِ إِحْسَانًا', translation: '"Worship Allah and associate nothing with Him, and be good to parents."', explanation: "In one breath, Allah links His own worship to kindness toward parents. After tawhid, the most important human relationship is with one's parents. Ihsan — excellence in conduct — is the standard, not just minimal politeness.", source: 'Surah An-Nisa • 4:36', sourceType: 'Quran', tag: 'Parents' },
  { id: 'ayah_5_32', category: 'Ayah', arabic: 'مَن قَتَلَ نَفْسًا بِغَيْرِ نَفْسٍ أَوْ فَسَادٍ فِي الْأَرْضِ فَكَأَنَّمَا قَتَلَ النَّاسَ جَمِيعًا', translation: '"Whoever kills a soul — it is as if he had killed all of mankind."', explanation: "Islam's most powerful statement on the sanctity of human life. Every single life carries the weight of all humanity. This makes every act of unjust violence an offence not just against one person but against the entire human family.", source: "Surah Al-Ma'idah • 5:32", sourceType: 'Quran', tag: 'Sanctity of Life' },
  { id: 'ayah_6_162', category: 'Ayah', arabic: 'قُلْ إِنَّ صَلَاتِي وَنُسُكِي وَمَحْيَايَ وَمَمَاتِي لِلَّهِ رَبِّ الْعَالَمِينَ', translation: '"Say: My prayer, my sacrifice, my life and my death are all for Allah, Lord of the worlds."', explanation: 'The ultimate declaration of purpose, recited at the start of salah. Nothing is secular, nothing is separate. Every breath is worship when offered with this intention.', source: "Surah Al-An'am • 6:162", sourceType: 'Quran', tag: 'Purpose of Life' },
  { id: 'ayah_7_23', category: 'Ayah', arabic: 'رَبَّنَا ظَلَمْنَا أَنفُسَنَا وَإِن لَّمْ تَغْفِرْ لَنَا وَتَرْحَمْنَا لَنَكُونَنَّ مِنَ الْخَاسِرِينَ', translation: '"Our Lord, we have wronged ourselves. If You do not forgive us and have mercy on us, we will surely be among the losers."', explanation: "The du'a of Adam and Hawwa after they erred. Full acknowledgement of fault, no excuses, complete dependence on divine forgiveness. Allah accepted it — and it has been the prayer of every sincere repenter since.", source: "Surah Al-A'raf • 7:23", sourceType: 'Quran', tag: 'Tawbah' },
  { id: 'ayah_7_180', category: 'Ayah', arabic: 'وَلِلَّهِ الْأَسْمَاءُ الْحُسْنَىٰ فَادْعُوهُ بِهَا', translation: '"To Allah belong the most beautiful names — so call upon Him by them."', explanation: "Allah's 99 names are doors to du'a. Call on Al-Shafi when sick, Al-Razzaq when in financial difficulty, Al-Ghaffar when seeking forgiveness. Each name is a direct line to a specific mercy of Allah.", source: "Surah Al-A'raf • 7:180", sourceType: 'Quran', tag: 'Names of Allah' },
  { id: 'ayah_8_2', category: 'Ayah', arabic: 'إِنَّمَا الْمُؤْمِنُونَ الَّذِينَ إِذَا ذُكِرَ اللَّهُ وَجِلَتْ قُلُوبُهُمْ', translation: '"The believers are only those who, when Allah is mentioned, their hearts tremble."', explanation: 'True faith is felt in the heart before it is expressed in action. The trembling is the awe of standing before the Greatest. A heart that feels nothing at the mention of Allah is a heart that needs attention.', source: 'Surah Al-Anfal • 8:2', sourceType: 'Quran', tag: 'True Faith' },
  { id: 'ayah_9_51', category: 'Ayah', arabic: 'قُل لَّن يُصِيبَنَا إِلَّا مَا كَتَبَ اللَّهُ لَنَا', translation: '"Say: Nothing will befall us except what Allah has decreed for us."', explanation: "Complete tawakkul in one sentence. Whatever harm comes your way was already written. When Allah's decree is your anchor, nothing can truly threaten you.", source: 'Surah At-Tawbah • 9:51', sourceType: 'Quran', tag: 'Tawakkul' },
  { id: 'ayah_10_57', category: 'Ayah', arabic: 'يَا أَيُّهَا النَّاسُ قَدْ جَاءَتْكُم مَّوْعِظَةٌ مِّن رَّبِّكُمْ وَشِفَاءٌ لِّمَا فِي الصُّدُورِ', translation: '"O mankind, there has come to you a reminder from your Lord and a healing for what is in the breasts."', explanation: 'The Quran is both a reminder and a shifa — a cure. Not just for physical ailment but for what is in the chest: anxiety, grief, confusion, despair. Scholars have always prescribed Quran recitation as medicine for the soul.', source: 'Surah Yunus • 10:57', sourceType: 'Quran', tag: 'Quran as Healing' },
  { id: 'ayah_11_6', category: 'Ayah', arabic: 'وَمَا مِن دَابَّةٍ فِي الْأَرْضِ إِلَّا عَلَى اللَّهِ رِزْقُهَا', translation: '"There is no creature on earth but that its provision is upon Allah."', explanation: 'Not a single living thing feeds itself. Allah provides for all of them. How then could He forget you? Rizq anxiety dissolves when this ayah is truly believed, not just read.', source: 'Surah Hud • 11:6', sourceType: 'Quran', tag: 'Rizq' },
  { id: 'ayah_12_87', category: 'Ayah', arabic: 'وَلَا تَيْأَسُوا مِن رَّوْحِ اللَّهِ ۖ إِنَّهُ لَا يَيْأَسُ مِن رَّوْحِ اللَّهِ إِلَّا الْقَوْمُ الْكَافِرُونَ', translation: '"Do not despair of relief from Allah. Indeed, no one despairs of Allah\'s relief except the disbelieving people."', explanation: "The words of Prophet Ya'qub (AS) after years of separation from his son Yusuf. Despair is not a sign of hardship — it is a sign of disconnection from Allah. As long as you are breathing, relief is still possible.", source: 'Surah Yusuf • 12:87', sourceType: 'Quran', tag: 'Hope' },
  { id: 'ayah_13_11', category: 'Ayah', arabic: 'إِنَّ اللَّهَ لَا يُغَيِّرُ مَا بِقَوْمٍ حَتَّىٰ يُغَيِّرُوا مَا بِأَنفُسِهِمْ', translation: '"Indeed, Allah will not change the condition of a people until they change what is in themselves."', explanation: 'External circumstances shift when internal ones do. If you want your life or situation to change — start with your own heart and intentions. This ayah kills the victim mentality and activates personal responsibility.', source: "Surah Ar-Ra'd • 13:11", sourceType: 'Quran', tag: 'Change' },
  { id: 'ayah_13_28', category: 'Ayah', arabic: 'أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ', translation: '"Verily, in the remembrance of Allah do hearts find rest."', explanation: "Every human heart is restless until it finds its way back to its Creator. No amount of wealth, success, or human love fills the void that only Allah's remembrance can fill.", source: "Surah Ar-Ra'd • 13:28", sourceType: 'Quran', tag: 'Peace of Heart' },
  { id: 'ayah_14_7', category: 'Ayah', arabic: 'لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ', translation: '"If you are grateful, I will surely increase you in blessing."', explanation: 'A divine economic principle: gratitude is the engine of abundance. Allah makes this an unconditional promise tied directly to a human action. Shukr is not just politeness — it is the mechanism of increase.', source: 'Surah Ibrahim • 14:7', sourceType: 'Quran', tag: 'Gratitude' },
  { id: 'ayah_15_9', category: 'Ayah', arabic: 'إِنَّا نَحْنُ نَزَّلْنَا الذِّكْرَ وَإِنَّا لَهُ لَحَافِظُونَ', translation: '"Indeed, it is We who sent down the Quran and indeed, We will be its guardian."', explanation: 'Unlike every other scripture, the Quran has a divine guarantee of preservation. Not a single letter has changed in 1400+ years, memorised by millions across centuries. This is one of the most verifiable miracles of Islam.', source: 'Surah Al-Hijr • 15:9', sourceType: 'Quran', tag: 'Preservation of Quran' },
  { id: 'ayah_16_97', category: 'Ayah', arabic: 'مَنْ عَمِلَ صَالِحًا مِّن ذَكَرٍ أَوْ أُنثَىٰ وَهُوَ مُؤْمِنٌ فَلَنُحْيِيَنَّهُ حَيَاةً طَيِّبَةً', translation: '"Whoever does righteousness — male or female — while being a believer, We will cause them to live a good life."', explanation: "The Quran's definition of the good life is not wealth or comfort but a tayyibah — pure and wholesome. It is available equally to all. The condition is iman and righteous action, not worldly circumstance.", source: 'Surah An-Nahl • 16:97', sourceType: 'Quran', tag: 'Good Life' },
  { id: 'ayah_17_44', category: 'Ayah', arabic: 'وَإِن مِّن شَيْءٍ إِلَّا يُسَبِّحُ بِحَمْدِهِ وَلَٰكِن لَّا تَفْقَهُونَ تَسْبِيحَهُمْ', translation: '"There is not a thing except that it glorifies His praise — but you do not understand their glorification."', explanation: 'The trees, rivers, mountains, stars — all are in constant tasbih right now. You are surrounded by a universe in worship. The believer who internalises this walks through the world differently.', source: 'Surah Al-Isra • 17:44', sourceType: 'Quran', tag: 'Universe in Worship' },
  { id: 'ayah_18_10', category: 'Ayah', arabic: 'رَبَّنَا آتِنَا مِن لَّدُنكَ رَحْمَةً وَهَيِّئْ لَنَا مِنْ أَمْرِنَا رَشَدًا', translation: '"Our Lord, grant us mercy from Yourself and prepare for us right guidance in our affair."', explanation: "The du'a of the People of the Cave — young men who fled persecution for their faith. When you do not know what to do or where to go, this is the du'a to make. Allah answered them with centuries of protected sleep.", source: 'Surah Al-Kahf • 18:10', sourceType: 'Quran', tag: 'Guidance' },
  { id: 'ayah_18_46', category: 'Ayah', arabic: 'الْمَالُ وَالْبَنُونَ زِينَةُ الْحَيَاةِ الدُّنْيَا ۖ وَالْبَاقِيَاتُ الصَّالِحَاتُ خَيْرٌ عِندَ رَبِّكَ', translation: '"Wealth and children are the adornment of worldly life. But the enduring good deeds are better with your Lord."', explanation: 'The things we spend most of our lives chasing are called adornment — pretty but not permanent. The enduring good deeds outlast everything and compound in the next life.', source: 'Surah Al-Kahf • 18:46', sourceType: 'Quran', tag: 'Dunya vs Akhirah' },
  { id: 'ayah_19_96', category: 'Ayah', arabic: 'إِنَّ الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ سَيَجْعَلُ لَهُمُ الرَّحْمَٰنُ وُدًّا', translation: '"Indeed, those who believe and do righteous deeds — the Most Merciful will appoint for them affection."', explanation: 'When you live righteously, Allah places love for you in the hearts of people. This is the divine mechanism behind genuine love — not charm or strategy, but Allah instilling affection for you in creation.', source: 'Surah Maryam • 19:96', sourceType: 'Quran', tag: 'Love from Allah' },
  { id: 'ayah_20_25', category: 'Ayah', arabic: 'رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي', translation: '"My Lord, expand for me my breast and ease for me my task."', explanation: "The du'a of Musa (AS) before confronting Pharaoh. He did not ask for victory or power — he asked for an open heart and ease. This is the du'a for every difficult task: an exam, a hard conversation, a new responsibility.", source: 'Surah Ta-Ha • 20:25-26', sourceType: 'Quran', tag: "Du'a of Musa" },
  { id: 'ayah_21_87', category: 'Ayah', arabic: 'لَّا إِلَٰهَ إِلَّا أَنتَ سُبْحَانَكَ إِنِّي كُنتُ مِنَ الظَّالِمِينَ', translation: '"There is no deity except You; exalted are You. Indeed, I have been of the wrongdoers."', explanation: "The du'a of Yunus (AS) from inside the whale. The Prophet ﷺ said no Muslim calls upon Allah with these words in any distress except that Allah relieves it. Three elements: tawhid, tasbih, and honest self-accounting.", source: 'Surah Al-Anbiya • 21:87', sourceType: 'Quran', tag: "Du'a of Yunus" },
  { id: 'ayah_22_46', category: 'Ayah', arabic: 'فَإِنَّهَا لَا تَعْمَى الْأَبْصَارُ وَلَٰكِن تَعْمَى الْقُلُوبُ الَّتِي فِي الصُّدُورِ', translation: '"It is not the eyes that are blind, but blind are the hearts which are within the breasts."', explanation: "Sight without insight is the deeper blindness. A person can see the sky, the seasons, the birth of a child — and still not see Allah. The believer's prayer is always for basirah — the insight of the heart.", source: 'Surah Al-Hajj • 22:46', sourceType: 'Quran', tag: 'Heart' },
  { id: 'ayah_23_1', category: 'Ayah', arabic: 'قَدْ أَفْلَحَ الْمُؤْمِنُونَ', translation: '"Certainly will the believers have succeeded."', explanation: "The opening of Surah Al-Mu'minun — a declaration of success before even listing the qualities. Success in Islam is not defined by the world's metrics: it is humility in prayer, avoiding vain talk, giving zakah, and guarding chastity.", source: "Surah Al-Mu'minun • 23:1", sourceType: 'Quran', tag: 'Success' },
  { id: 'ayah_24_35', category: 'Ayah', arabic: 'اللَّهُ نُورُ السَّمَاوَاتِ وَالْأَرْضِ', translation: '"Allah is the light of the heavens and the earth."', explanation: 'Ayat al-Nur — one of the most celebrated verses for its depth and beauty. The physical universe is lit by the sun, but existence itself is illuminated by the divine light of Allah. Noor upon noor.', source: 'Surah An-Nur • 24:35', sourceType: 'Quran', tag: 'Light of Allah' },
  { id: 'ayah_25_63', category: 'Ayah', arabic: 'وَعِبَادُ الرَّحْمَٰنِ الَّذِينَ يَمْشُونَ عَلَى الْأَرْضِ هَوْنًا', translation: '"The servants of the Most Merciful are those who walk upon the earth humbly."', explanation: 'The list of qualities of Ibad al-Rahman begins not with grand acts of worship but with how they walk. Humility in gait reflects humility in heart. The believer moves through the world without arrogance or entitlement.', source: 'Surah Al-Furqan • 25:63', sourceType: 'Quran', tag: 'Humility' },
  { id: 'ayah_26_80', category: 'Ayah', arabic: 'وَإِذَا مَرِضْتُ فَهُوَ يَشْفِينِ', translation: '"And when I am ill, it is He who cures me."', explanation: 'The words of Ibrahim (AS) — he says "when I am ill" attributing illness to himself, but "He cures me" attributing healing to Allah. This is the adab of the prophets: never blame Allah for hardship, always credit Him for relief.', source: "Surah Ash-Shu'ara • 26:80", sourceType: 'Quran', tag: 'Healing' },
  { id: 'ayah_27_62', category: 'Ayah', arabic: 'أَمَّن يُجِيبُ الْمُضْطَرَّ إِذَا دَعَاهُ وَيَكْشِفُ السُّوءَ', translation: '"Who responds to the desperate one when he calls upon Him, and removes the harm?"', explanation: "Al-Mudtarr — the desperate one at the end of their rope. Allah singles out this category for special attention. The more desperate the du'a, the more direct the divine response. Your worst moment may be your closest moment to Allah.", source: 'Surah An-Naml • 27:62', sourceType: 'Quran', tag: "Du'a in Desperation" },
  { id: 'ayah_29_45', category: 'Ayah', arabic: 'إِنَّ الصَّلَاةَ تَنْهَىٰ عَنِ الْفَحْشَاءِ وَالْمُنكَرِ', translation: '"Indeed, prayer prohibits immorality and wrongdoing."', explanation: "Salah is not just ritual — it is transformation. A prayer that does not change your character outside the prayer mat is missing something. The true effect of salah is visible in how you treat people and what you refuse when no one is watching.", source: "Surah Al-'Ankabut • 29:45", sourceType: 'Quran', tag: 'Power of Salah' },
  { id: 'ayah_30_21', category: 'Ayah', arabic: 'وَمِنْ آيَاتِهِ أَن خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا', translation: '"And of His signs is that He created for you from yourselves mates that you may find tranquility in them."', explanation: "Marriage in the Quran is described as a divine sign and its purpose is sukun — tranquility and stillness. Not just companionship but a place where the soul rests. A righteous spouse is one of Allah's greatest gifts.", source: 'Surah Ar-Rum • 30:21', sourceType: 'Quran', tag: 'Marriage' },
  { id: 'ayah_31_17', category: 'Ayah', arabic: 'يَا بُنَيَّ أَقِمِ الصَّلَاةَ وَأْمُرْ بِالْمَعْرُوفِ وَانْهَ عَنِ الْمُنكَرِ وَاصْبِرْ عَلَىٰ مَا أَصَابَكَ', translation: '"O my son, establish prayer, enjoin what is right, forbid what is wrong, and be patient over whatever befalls you."', explanation: "Luqman's advice to his son — the most complete parenting curriculum in the Quran. Four instructions: pray, stand for good, oppose wrong, endure hardship. A believer who lives by these four will never be lost.", source: 'Surah Luqman • 31:17', sourceType: 'Quran', tag: 'Wisdom of Luqman' },
  { id: 'ayah_33_41', category: 'Ayah', arabic: 'يَا أَيُّهَا الَّذِينَ آمَنُوا اذْكُرُوا اللَّهَ ذِكْرًا كَثِيرًا', translation: '"O you who believe, remember Allah with much remembrance."', explanation: 'The only act of worship where Allah commands "much." In prayer there is a set number, in fasting a fixed month — but in dhikr the instruction is: do not stop. The tongue can always be busy with Allah even when the hands are busy with the world.', source: 'Surah Al-Ahzab • 33:41', sourceType: 'Quran', tag: 'Dhikr' },
  { id: 'ayah_35_15', category: 'Ayah', arabic: 'يَا أَيُّهَا النَّاسُ أَنتُمُ الْفُقَرَاءُ إِلَى اللَّهِ ۖ وَاللَّهُ هُوَ الْغَنِيُّ الْحَمِيدُ', translation: '"O mankind, you are the ones in need of Allah, while Allah is the Free of need, the Praiseworthy."', explanation: 'Fuqara — all of humanity is needy before Allah. Not some of us, not the weak — all of us. Our very existence and next heartbeat is borrowed. Recognising this need is the beginning of true worship.', source: 'Surah Fatir • 35:15', sourceType: 'Quran', tag: 'Human Need' },
  { id: 'ayah_39_53', category: 'Ayah', arabic: 'قُلْ يَا عِبَادِيَ الَّذِينَ أَسْرَفُوا عَلَىٰ أَنفُسِهِمْ لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ ۚ إِنَّ اللَّهَ يَغْفِرُ الذُّنُوبَ جَمِيعًا', translation: '"O My servants who have transgressed — do not despair of the mercy of Allah. Indeed, Allah forgives all sins."', explanation: "The most hope-giving ayah in the Quran according to many scholars. Not some sins — all sins. Not for some people — for all who turn to Him. The only condition is turning back. No matter how far you have gone, the door of tawbah is open.", source: 'Surah Az-Zumar • 39:53', sourceType: 'Quran', tag: 'Divine Forgiveness' },
  { id: 'ayah_40_60', category: 'Ayah', arabic: 'وَقَالَ رَبُّكُمُ ادْعُونِي أَسْتَجِبْ لَكُمْ', translation: '"And your Lord said: Call upon Me, I will respond to you."', explanation: "A direct divine command and a direct divine promise. This is not conditional on your worthiness. Allah does not say call upon Me if you deserve it — He says call, and I answer. Du'a is never wasted.", source: 'Surah Ghafir • 40:60', sourceType: 'Quran', tag: "Power of Du'a" },
  { id: 'ayah_49_10', category: 'Ayah', arabic: 'إِنَّمَا الْمُؤْمِنُونَ إِخْوَةٌ', translation: '"The believers are but brothers."', explanation: 'Three words that define the entire social structure of Islam. Not allies, not fellow citizens — brothers. The brotherhood of faith transcends race, language, nationality, and class. When this is truly lived, no Muslim suffers alone.', source: 'Surah Al-Hujurat • 49:10', sourceType: 'Quran', tag: 'Brotherhood' },
  { id: 'ayah_49_13', category: 'Ayah', arabic: 'إِنَّ أَكْرَمَكُمْ عِندَ اللَّهِ أَتْقَاكُمْ', translation: '"Indeed, the most noble of you in the sight of Allah is the most righteous of you."', explanation: 'The only criterion of rank before Allah. Not skin colour, tribe, nationality, or wealth — taqwa alone. This single ayah dismantles every form of racism and tribalism in one sentence.', source: 'Surah Al-Hujurat • 49:13', sourceType: 'Quran', tag: 'Equality' },
  { id: 'ayah_51_56', category: 'Ayah', arabic: 'وَمَا خَلَقْتُ الْجِنَّ وَالْإِنسَ إِلَّا لِيَعْبُدُونِ', translation: '"I did not create jinn and mankind except to worship Me."', explanation: 'The purpose of existence in one sentence. The word ibadah is broader than ritual — it encompasses every action done with awareness of Allah. Your work, relationships, and rest can all be worship.', source: 'Surah Adh-Dhariyat • 51:56', sourceType: 'Quran', tag: 'Purpose of Creation' },
  { id: 'ayah_55_13', category: 'Ayah', arabic: 'فَبِأَيِّ آلَاءِ رَبِّكُمَا تُكَذِّبَانِ', translation: '"So which of the favours of your Lord would you deny?"', explanation: "Repeated 31 times in Surah Ar-Rahman — Allah listing His blessings and asking which one you will deny. When you count blessings instead of problems, your entire perspective shifts.", source: 'Surah Ar-Rahman • 55:13', sourceType: 'Quran', tag: 'Blessings of Allah' },
  { id: 'ayah_65_3', category: 'Ayah', arabic: 'وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ ۚ إِنَّ اللَّهَ بَالِغُ أَمْرِهِ', translation: '"Whoever relies upon Allah — then He is sufficient for him. Indeed, Allah will accomplish His purpose."', explanation: "Hasbunallah — Allah is enough. When you truly hand your affairs to Allah after taking the means, He does not just help — He takes over entirely. Every divine decree leads to good for the believer.", source: 'Surah At-Talaq • 65:3', sourceType: 'Quran', tag: 'Tawakkul' },
  { id: 'ayah_67_2', category: 'Ayah', arabic: 'الَّذِي خَلَقَ الْمَوْتَ وَالْحَيَاةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًا', translation: '"He who created death and life to test you as to which of you is best in deed."', explanation: 'Death is mentioned before life — it was created first. The test is not who does the most but who does the best. Ikhlas and itqan transform ordinary actions into extraordinary worship.', source: 'Surah Al-Mulk • 67:2', sourceType: 'Quran', tag: 'Purpose of Life' },
  { id: 'ayah_93_3', category: 'Ayah', arabic: 'مَا وَدَّعَكَ رَبُّكَ وَمَا قَلَىٰ', translation: '"Your Lord has not abandoned you, nor has He become displeased with you."', explanation: 'Revealed when revelation paused and the Prophet ﷺ feared abandonment. The divine reassurance is direct: I have not left you. Whenever you feel distant from Allah, remember — it is you who moved, not Him.', source: 'Surah Ad-Duha • 93:3', sourceType: 'Quran', tag: 'Never Abandoned' },
  { id: 'ayah_94_6', category: 'Ayah', arabic: 'إِنَّ مَعَ الْعُسْرِ يُسْرًا', translation: '"Indeed, with hardship will be ease."', explanation: 'Repeated twice in Surah Ash-Sharh. Scholars note that in Arabic, one hardship is definite while ease is indefinite — meaning one hardship but multiple eases. Allah never sends difficulty alone. The relief is already on its way.', source: 'Surah Ash-Sharh • 94:6', sourceType: 'Quran', tag: 'With Hardship Comes Ease' },
  { id: 'ayah_96_1', category: 'Ayah', arabic: 'اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ', translation: '"Read in the name of your Lord who created."', explanation: 'The first word revealed was not "pray" or "fast" — it was "Read." Islam began with a command to learn. Knowledge paired with the name of Allah is the foundation of Islamic civilisation. Every book opened in His name is an act of worship.', source: 'Surah Al-Alaq • 96:1', sourceType: 'Quran', tag: 'First Revelation' },
  { id: 'ayah_112_1', category: 'Ayah', arabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ', translation: '"Say: He is Allah, the One."', explanation: 'Surah Al-Ikhlas — equal in reward to one third of the Quran. Four ayahs that define all of Islamic theology: Allah is One, the Eternal Refuge, He neither begets nor was begotten, and nothing is comparable to Him.', source: 'Surah Al-Ikhlas • 112:1', sourceType: 'Quran', tag: 'Tawhid' },

];