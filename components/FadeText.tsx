import { BlurView } from "expo-blur";
import React, { memo, useEffect } from "react";
import { StyleSheet, Text, View, type ViewStyle, type TextStyle } from "react-native";
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

interface FadeTextProps {
  inputs: string[];
  wordDelay?: number;
  duration?: number;
  blurIntensity?: [number, number, number];
  blurTint?: "dark" | "light" | "default";
  scaleRange?: [number, number];
  translateYRange?: [number, number];
  opacityRange?: [number, number, number];
  fontSize?: number;
  fontWeight?: TextStyle["fontWeight"];
  color?: string;
  textAlign?: TextStyle["textAlign"];
  containerStyle?: ViewStyle;
  style?: TextStyle;
  fontFamily?: string;
}

interface AnimatedWordProps {
  word: string;
  delay: number;
  duration: number;
  blurIntensity: [number, number, number];
  blurTint: "dark" | "light" | "default";
  scaleRange: [number, number];
  translateYRange: [number, number];
  opacityRange: [number, number, number];
  fontSize: number;
  fontWeight: TextStyle["fontWeight"];
  color: string;
  textAlign: TextStyle["textAlign"];
  style?: TextStyle;
  fontFamily?: string;
}

const AnimatedWord: React.FC<AnimatedWordProps> = memo(
  ({
    word,
    delay,
    duration,
    blurIntensity,
    blurTint,
    scaleRange,
    translateYRange,
    opacityRange,
    fontSize,
    fontWeight,
    color,
    textAlign,
    style,
    fontFamily,
  }) => {
    const animationValue = useSharedValue(0);

    useEffect(() => {
      animationValue.value = withDelay(
        delay,
        withTiming(1, {
          duration,
          easing: Easing.out(Easing.cubic),
        })
      );
    }, [delay, duration, animationValue]);

    const animatedStyle = useAnimatedStyle(() => {
      const opacity = interpolate(
        animationValue.value,
        [0, 0.8, 1],
        opacityRange,
        Extrapolation.CLAMP
      );
      const scale = interpolate(
        animationValue.value,
        [0, 1],
        scaleRange,
        Extrapolation.CLAMP
      );
      const translateY = interpolate(
        animationValue.value,
        [0, 1],
        translateYRange,
        Extrapolation.CLAMP
      );
      return {
        opacity,
        transform: [{ scale }, { translateY }],
      };
    });

    const blurAnimatedProps = useAnimatedProps(() => {
      const intensity = withSpring(
        interpolate(
          animationValue.value,
          [0, 0.3, 1],
          blurIntensity,
          Extrapolation.CLAMP
        )
      );
      return { intensity };
    });

    return (
      <Animated.View style={[styles.wordContainer, animatedStyle]}>
        <Text
          style={[
            styles.word,
            {
              fontSize,
              fontWeight,
              color,
              textAlign,
              ...(fontFamily ? { fontFamily } : {}),
            },
            style,
          ]}
        >
          {word}{" "}
        </Text>
        <AnimatedBlurView
          style={StyleSheet.absoluteFillObject}
          animatedProps={blurAnimatedProps}
          tint={blurTint}
        />
      </Animated.View>
    );
  }
);

AnimatedWord.displayName = "AnimatedWord";

export const FadeText: React.FC<FadeTextProps> = memo(
  ({
    inputs,
    wordDelay = 300,
    duration = 800,
    blurIntensity = [30, 10, 0] as [number, number, number],
    blurTint = "dark",
    scaleRange = [0.97, 1] as [number, number],
    translateYRange = [10, 0] as [number, number],
    opacityRange = [0, 0.5, 1] as [number, number, number],
    fontSize = 32,
    fontWeight = "600",
    color = "#ffffff",
    textAlign = "center",
    containerStyle,
    style,
    fontFamily,
  }) => {
    const words = inputs.flatMap((text) =>
      text.split(" ").map((word) => ({ word }))
    );

    return (
      <View style={[styles.container, containerStyle]}>
        <View style={styles.textWrapper}>
          {words.map((item, index) => (
            <AnimatedWord
              key={index}
              word={item.word}
              delay={index * wordDelay}
              duration={duration}
              blurIntensity={blurIntensity}
              blurTint={blurTint}
              scaleRange={scaleRange}
              translateYRange={translateYRange}
              opacityRange={opacityRange}
              fontSize={fontSize}
              style={style}
              fontWeight={fontWeight}
              color={color}
              textAlign={textAlign}
              fontFamily={fontFamily}
            />
          ))}
        </View>
      </View>
    );
  }
);

FadeText.displayName = "FadeText";

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "flex-start",
  },
  textWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
  },
  wordContainer: {
    overflow: "hidden",
    borderRadius: 4,
  },
  word: {},
});
