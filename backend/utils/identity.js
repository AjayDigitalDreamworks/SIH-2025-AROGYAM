const crypto = require('crypto');

const adjectives = ['Sleepy', 'Angry', 'Witty', 'Weird', 'Curious', 'Lazy', 'Noisy', 'Happy'];
const animals = ['Panda', 'Banana', 'Tiger', 'Turtle', 'Duck', 'Llama', 'Frog', 'Penguin'];

function generateFunnyName() {
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const animal = animals[Math.floor(Math.random() * animals.length)];
  const number = Math.floor(10 + Math.random() * 90);
  return `${adj}${animal}${number}`;
}

function generateUniqueId() {
  return crypto.randomBytes(6).toString('hex');
}

function generateAvatarUrl(uniqueId) {
  return `https://avatars.dicebear.com/api/fun-emoji/${uniqueId}.svg`;
}

function generateUserIdentity() {
  const name = generateFunnyName();
  const uniqueId = generateUniqueId();
  const avatar = generateAvatarUrl(uniqueId);

  return {
    aliasName: name,
    uniqueId,
    avatarUrl: avatar,
  };
}

module.exports = generateUserIdentity;
