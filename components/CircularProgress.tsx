import React, { memo, useEffect } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withTiming,
  Easing,
} from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface CircularProgressProps {
  /** Progress value from 0 to 100 */
  progress?: number;
  /** Diameter of the circle */
  size?: number;
  /** Width of the progress stroke */
  strokeWidth?: number;
  /** Color of the background track */
  trackColor?: string;
  /** Color of the progress arc */
  progressColor?: string;
  /** Background color of the inner circle */
  backgroundColor?: string;
  /** Gap between stroke and inner circle */
  gap?: number;
  /** Press handler */
  onPress?: () => void;
  /** Custom content inside the circle */
  renderIcon?: () => React.ReactNode;
  /** Whether to animate the progress change */
  animated?: boolean;
  /** Animation duration in ms */
  animationDuration?: number;
}

export const CircularProgress: React.FC<CircularProgressProps> = memo(
  ({
    progress = 0,
    size = 80,
    strokeWidth = 3,
    trackColor = "rgba(255, 255, 255, 0.08)",
    progressColor = "#DBC188",
    backgroundColor = "#161616",
    gap = 3,
    onPress,
    renderIcon,
    animated = true,
    animationDuration = 1200,
  }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const progressValue = useSharedValue(0);

    useEffect(() => {
      const clampedProgress = Math.min(Math.max(progress, 0), 100);
      if (animated) {
        progressValue.value = withTiming(clampedProgress, {
          duration: animationDuration,
          easing: Easing.out(Easing.cubic),
        });
      } else {
        progressValue.value = clampedProgress;
      }
    }, [progress, animated, animationDuration]);

    const animatedCircleProps = useAnimatedProps(() => {
      const strokeDashoffset =
        circumference * (1 - progressValue.value / 100);
      return { strokeDashoffset };
    });

    const innerCircleSize = size - strokeWidth * 2 - gap * 2;
    const innerCirclePosition = strokeWidth + gap;

    const content = (
      <View style={{ width: size, height: size }}>
        <Svg width={size} height={size}>
          {/* Background track */}
          <Circle
            stroke={trackColor}
            fill="none"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
          />
          {/* Animated progress arc */}
          <AnimatedCircle
            stroke={progressColor}
            fill="none"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeDasharray={`${circumference} ${circumference}`}
            strokeLinecap="round"
            transform={`rotate(-90, ${size / 2}, ${size / 2})`}
            strokeWidth={strokeWidth}
            animatedProps={animatedCircleProps}
          />
        </Svg>
        {/* Inner circle with icon */}
        <View
          style={[
            styles.innerCircle,
            {
              width: innerCircleSize,
              height: innerCircleSize,
              backgroundColor,
              borderRadius: innerCircleSize / 2,
              top: innerCirclePosition,
              left: innerCirclePosition,
            },
          ]}
        >
          {renderIcon?.()}
        </View>
      </View>
    );

    if (onPress) {
      return <Pressable onPress={onPress}>{content}</Pressable>;
    }

    return content;
  }
);

const styles = StyleSheet.create({
  innerCircle: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
});
