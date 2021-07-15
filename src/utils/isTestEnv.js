export const isTestEnv = process.env.STORYBOOK || process.env.NODE_ENV === 'test'

export const isJest = process.env.NODE_ENV === 'test'

export const isStorybook = !!process.env.STORYBOOK
