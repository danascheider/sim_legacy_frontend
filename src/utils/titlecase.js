/*
 *
 * This duplicates the logic in the back end's Titlecase lib module. This module
 * attempts to accurately title-case titles instead of just making every word
 * capitalised.
 *
 * There is a comment in the file where this module is defined on the backend
 * detailing the challenges of accurate title casing. Primarily, these challenges
 * arise from two factors: (1) inconsistency of style guides and (2) the fact that
 * most style guides consider part of speech in determining whether a word should
 * be capitalised. This can be problematic with words like "like", which  can be
 * a preposition, adjective, adverb, or conjunction, depending on usage. In general,
 * prepositions, conjunctions, and short (< 5-character) adverbs should be all
 * lower case.
 *
 * This code does not attempt to guess part of speech or do any other tricks to
 * determine which words should be capitalised. It capitalises the first and last
 * word of the string (standard in almost all style guides) and any words in the
 * middle, other than the designated LOWERCASE_WORDS, which are only capitalised
 * if they are the first or last word in the string.
 *
 */

const LOWERCASE_WORDS = [
  'a',
  'an',
  'the',
  'and',
  'but',
  'for',
  'at',
  'by',
  'from',
  'with',
  'to',
  'in',
  'of',
  'into',
  'onto',
  'on',
  'without',
  'within'
]

const capitalize = word => {
  const letter = word[0].toUpperCase()
  return `${letter}${word.slice(1)}`
}

const titlecase = text => {
  const words = text.toLowerCase().split(' ')

  return words.map((word, index) => (
    LOWERCASE_WORDS.indexOf(word) > -1 && [1, words.length].indexOf(index) === -1 ? word : capitalize(word)
  )).join(' ')
}

export default titlecase
