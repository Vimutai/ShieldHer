/**
 * Score Calculator Tests
 * Run with: npm test
 */
import { calculateScore, interpretScore } from '../utils/scoreCalculator'

// Mock questions array (matches the real questions structure)
const MOCK_QUESTIONS = [
  { id: 'social_public', category: 'visibility', weight: 3, invertScore: false },
  { id: 'location_sharing', category: 'location', weight: 4, invertScore: false },
  { id: 'password_reuse', category: 'security', weight: 4, invertScore: false },
  { id: 'two_factor', category: 'security', weight: 3, invertScore: true },
  { id: 'personal_info', category: 'identity', weight: 5, invertScore: false },
]

describe('calculateScore', () => {
  
  test('returns high score for all safe answers', () => {
    // Safe answers: No to all normal questions, Yes to inverted (2FA)
    const safeAnswers = {
      social_public: false,      // No = safe
      location_sharing: false,   // No = safe
      password_reuse: false,     // No = safe
      two_factor: true,          // Yes = safe (inverted)
      personal_info: false,      // No = safe
    }
    
    const result = calculateScore(safeAnswers, MOCK_QUESTIONS)
    
    expect(result.overall).toBeGreaterThanOrEqual(90)
    expect(result.riskAreas).toHaveLength(0)
    expect(result).toHaveProperty('categories')
    expect(result).toHaveProperty('timestamp')
  })

  test('returns low score for all risky answers', () => {
    // Risky answers: Yes to all normal questions, No to inverted (2FA)
    const riskyAnswers = {
      social_public: true,       // Yes = risky
      location_sharing: true,    // Yes = risky
      password_reuse: true,      // Yes = risky
      two_factor: false,         // No = risky (inverted)
      personal_info: true,       // Yes = risky
    }
    
    const result = calculateScore(riskyAnswers, MOCK_QUESTIONS)
    
    expect(result.overall).toBeLessThanOrEqual(30)
    expect(result.riskAreas.length).toBeGreaterThan(0)
  })

  test('handles partial/missing answers correctly', () => {
    // Only some questions answered
    const partialAnswers = {
      social_public: false,
      two_factor: true,
      // Others not answered
    }
    
    const result = calculateScore(partialAnswers, MOCK_QUESTIONS)
    
    // Should still return a valid score
    expect(result.overall).toBeGreaterThanOrEqual(0)
    expect(result.overall).toBeLessThanOrEqual(100)
    expect(result).toHaveProperty('categories')
  })

})

describe('interpretScore', () => {
  
  test('returns correct level for excellent score', () => {
    const result = interpretScore(85)
    expect(result.level).toBe('excellent')
    expect(result.color).toBe('green')
  })

  test('returns correct level for moderate score', () => {
    const result = interpretScore(50)
    expect(result.level).toBe('moderate')
    expect(result.color).toBe('yellow')
  })

  test('returns correct level for critical score', () => {
    const result = interpretScore(15)
    expect(result.level).toBe('critical')
    expect(result.color).toBe('red')
  })

})

