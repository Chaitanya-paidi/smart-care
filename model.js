const bcrypt = require('bcryptjs');

const plainPassword = 'Gmail password';
const hashedPassword = '$2a$10$qH78J8C0qnAQWcFRo4SBI.Wz9dTTDjnfcrMvD7LaJ.lGShax7juMi';

bcrypt.compare(plainPassword, hashedPassword, (err, isMatch) => {
  if (err) throw err;
  console.log('Manual password comparison result:', isMatch);
});
