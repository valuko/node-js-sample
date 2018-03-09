
//Check for Palindrom.Palindrome is a word spelt b
var string = 'Anna';
function isPalindrome(str) {
    let splitString = string.split(' ');
    let initialString = splitString.reduce((a, b) => {
      return a + b;
    });
    initialString=initialString.toLowerCase();
    reversedString = initialString.split('').reverse().join('').toLowerCase();
  if (reversedString === initialString) {
    return console.log(`"${string}" is a Palindrome`);
  }
  return console.log(`"${string}" isn't a Palindrome`);
}
isPalindrome(string);
