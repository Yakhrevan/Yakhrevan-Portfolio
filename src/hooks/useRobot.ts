import { useState, useEffect, useCallback } from 'react';
import { robotController } from '../components/Robot/RobotController';
import { RobotControllerState, RobotState, RobotStateConfig } from '../types/robot';

export function useRobot() {
  const [state, setState] = useState<RobotControllerState>(robotController.getState());

  useEffect(() => {
    const unsubscribe = robotController.subscribe((newState) => {
      setState(newState);
    });
    return unsubscribe;
  }, []);

  const changeState = useCallback((newState: RobotState, durationMs?: number, customMessage?: string) => {
    robotController.setState(newState, durationMs, customMessage);
  }, []);

  const triggerWave = useCallback(() => {
    robotController.triggerWave();
  }, []);

  const triggerHappy = useCallback(() => {
    robotController.triggerHappy();
  }, []);

  const triggerExcited = useCallback(() => {
    robotController.triggerExcited();
  }, []);

  const setBlueprintMode = useCallback((enabled: boolean) => {
    robotController.setBlueprintMode(enabled);
  }, []);

  const toggleBlueprintMode = useCallback(() => {
    robotController.toggleBlueprintMode();
  }, []);

  const setConsoleOpen = useCallback((open: boolean) => {
    robotController.setConsoleOpen(open);
  }, []);

  const toggleConsole = useCallback(() => {
    robotController.toggleConsole();
  }, []);

  const setSpeed = useCallback((speed: number) => {
    robotController.setSpeed(speed);
  }, []);

  const setSpeechBubbleVisible = useCallback((visible: boolean) => {
    robotController.setSpeechBubbleVisible(visible);
  }, []);

  const setTargetSection = useCallback((section: string) => {
    robotController.setTargetSection(section);
  }, []);

  const executeCommand = useCallback((command: string) => {
    return robotController.executeCommand(command);
  }, []);

  const currentConfig: RobotStateConfig = robotController.getConfig();

  return {
    state,
    config: currentConfig,
    changeState,
    triggerWave,
    triggerHappy,
    triggerExcited,
    setBlueprintMode,
    toggleBlueprintMode,
    setConsoleOpen,
    toggleConsole,
    setSpeed,
    setSpeechBubbleVisible,
    setTargetSection,
    executeCommand,
  };
}
