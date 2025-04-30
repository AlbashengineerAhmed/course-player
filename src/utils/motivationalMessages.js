/**
 * Utility functions for generating motivational messages based on student level
 */

/**
 * Get a motivational message based on student level
 * @param {string} level - The student level (beginner, intermediate, advanced)
 * @returns {string} A motivational message in Arabic
 */
export const getMotivationalMessage = (level) => {
  const messages = {
    beginner: [
      "عظيم يا صديقي! أحلى بداية من الكورس ده. أكمل بنفس الحماس، كل خطوة بتقربك من هدفك. 🌟",
      "بداية رائعة! استمر في التعلم وستصل إلى أهدافك. الرحلة تبدأ بخطوة واحدة. 🚀",
      "أنت على الطريق الصحيح! كل يوم تتعلم فيه شيئًا جديدًا هو يوم ناجح. 💪",
      "لا تقلق من البداية، كل الخبراء كانوا مبتدئين في يوم ما. استمر في العمل الجاد! 🌱",
      "خطواتك الأولى تبشر بمستقبل مشرق. استمر في التقدم! 🔆"
    ],
    intermediate: [
      "عظيم يا صديقي! أحلى أداء من الكورس ده. أكمل من 80% بنفس الحماس، كل خطوة بتعلي. أشوف اسمك في الليدربورد هنا 🏆",
      "أنت تتقدم بشكل رائع! استمر في هذا المستوى وستصل إلى القمة قريبًا. 🚀",
      "نصف الطريق قد قطعته بنجاح! الآن حان وقت مضاعفة الجهد للوصول إلى المستوى المتقدم. 🔥",
      "أداؤك يتحسن يومًا بعد يوم. حافظ على هذا الحماس وستحقق أهدافك. 📈",
      "أنت في المنتصف، لا تتوقف الآن! القمة أصبحت قريبة. 🌄"
    ],
    advanced: [
      "ممتاز! أنت من أفضل الطلاب في هذا الكورس. استمر في التفوق وحافظ على مستواك المتميز. أنت قدوة لزملائك! 🥇",
      "تهانينا! أنت الآن في المستوى المتقدم. استمر في صقل مهاراتك لتصبح خبيرًا. 🏅",
      "أداؤك استثنائي! أنت مثال للطلاب الآخرين في الالتزام والتفوق. 🌟",
      "أنت على وشك إتقان هذا المجال! استمر في التعلم والتطبيق العملي. 🔝",
      "قدراتك المتقدمة تضعك في مصاف الخبراء. واصل التميز! 👑"
    ],
    struggling: [
      "لا تستسلم! كل التحديات التي تواجهها الآن ستجعلك أقوى في المستقبل. 💪",
      "الصعوبات جزء من رحلة التعلم. خذ وقتك واستمر في المحاولة. 🌱",
      "لا بأس من التعثر أحيانًا، المهم أن تنهض وتواصل المسير. 🚶‍♂️",
      "كل خبير مر بلحظات صعبة في بداياته. الاستمرارية هي مفتاح النجاح. 🔑",
      "أنت أقوى مما تظن! تجاوز هذه المرحلة الصعبة وستفخر بنفسك. ⭐"
    ]
  };
  
  // Get random message from the appropriate category
  const categoryMessages = messages[level] || messages.beginner;
  const randomIndex = Math.floor(Math.random() * categoryMessages.length);
  
  return categoryMessages[randomIndex];
};

/**
 * Get a motivational message based on progress percentage
 * @param {number} progress - The student progress percentage (0-100)
 * @returns {string} A motivational message in Arabic
 */
export const getMessageByProgress = (progress) => {
  if (progress < 30) {
    return getMotivationalMessage("beginner");
  } else if (progress < 70) {
    return getMotivationalMessage("intermediate");
  } else {
    return getMotivationalMessage("advanced");
  }
};

/**
 * Get a motivational message based on rank in leaderboard
 * @param {number} rank - The student rank in leaderboard
 * @param {number} totalStudents - Total number of students
 * @returns {string} A motivational message in Arabic
 */
export const getMessageByRank = (rank, totalStudents) => {
  const percentile = (totalStudents - rank) / totalStudents * 100;
  
  if (percentile > 90) {
    return getMotivationalMessage("advanced");
  } else if (percentile > 50) {
    return getMotivationalMessage("intermediate");
  } else {
    return getMotivationalMessage("beginner");
  }
};
