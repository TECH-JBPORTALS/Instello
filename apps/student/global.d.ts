import type { SvgProps as DefaultSvgProps } from 'react-native-svg'

declare module '*.png'

declare module 'react-native-svg' {
  interface SvgProps extends DefaultSvgProps {
    className?: string
  }
}
declare module 'phosphor-react-native' {
  interface IconProps extends DefaultIconProps {
    className?: string
  }
}

declare global {
  interface CustomJwtSessionClaims {
    metadata?: {
      onBoardingCompleted?: boolean
    }
  }
}

declare module '@mux/mux-data-react-native-video'
