import React, { useEffect, useState, useRef, memo } from "react";
import { Text, type TextStyle } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";

interface TypewriterTextProps {
  /** The full text to reveal progressively */
  text: string;
  /** Delay between each word appearing (ms) */
  wordDelay?: number;
  /** Whether to animate or show the full text immediately */
  animate?: boolean;
  /** Called when the full text has been revealed */
  onComplete?: () => void;
  /** Text style class name (NativeWind) */
  className?: string;
  /** Inline text style */
  style?: TextStyle;
}

export const TypewriterText: React.FC<TypewriterTextProps> = memo(
  ({
    text,
    wordDelay = 50,
    animate = true,
    onComplete,
    className,
    style,
  }) => {
    const [visibleWordCount, setVisibleWordCount] = useState(
      animate ? 0 : text.split(" ").length
    );
    const opacity = useSharedValue(animate ? 0 : 1);
    const words = text.split(" ");
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
      if (!animate) {
        setVisibleWordCount(words.length);
        return;
      }

      // Fade in the container
      opacity.value = withTiming(1, {
        duration: 200,
        easing: Easing.out(Easing.cubic),
      });

      // Progressively reveal words
      let count = 0;
      intervalRef.current = setInterval(() => {
        count++;
        setVisibleWordCount(count);
        if (count >= words.length) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          onComplete?.();
        }
      }, wordDelay);

      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }, [text, animate]);

    const containerStyle = useAnimatedStyle(() => ({
      opacity: opacity.value,
    }));

    const visibleText = words.slice(0, visibleWordCount).join(" ");

    return (
      <Animated.View style={containerStyle}>
        <Text className={className} style={style}>
          {visibleText}
        </Text>
      </Animated.View>
    );
  }
);
