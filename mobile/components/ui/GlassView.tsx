import React from 'react';
import { View, ViewProps } from 'react-native';

type Props = ViewProps & {
  intensity?: number;
  children?: React.ReactNode;
};

export default function GlassView({ intensity = 20, children, style, ...rest }: Props) {
  return (
    <View
      {...rest}
      style={[
        {
          backgroundColor: 'rgba(255,255,255,0.03)',
          borderColor: 'rgba(255,255,255,0.06)',
          borderWidth: 1,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.18,
          shadowRadius: intensity / 2,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
