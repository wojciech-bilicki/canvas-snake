import React, { useCallback, useEffect, useState } from 'react';
import { SEGMENT_SIZE } from '../draw/draw';
import randomPositionOnGrid from '../utils/randomPositionOnGrid';
import useInterval from '../utils/useInterval';
import { GameState } from './Game';
import createSnakeMovement, {
  hasSnakeEatenItself,
  willSnakeHitTheFood,
} from './movement';

export interface Position {
  x: number;
  y: number;
}

export enum Direction {
  UP,
  DOWN,
  LEFT,
  RIGHT,
}

const MOVEMENT_SPEED = 100;

interface UseGameLogicArgs {
  canvasWidth?: number;
  canvasHeight?: number;
  onGameOver: () => void;
  gameState: GameState;
}

const useGameLogic = ({
  canvasHeight,
  canvasWidth,
  onGameOver,
  gameState,
}: UseGameLogicArgs) => {
  const [direction, setDirection] = useState<Direction | undefined>();
  const [snakeBody, setSnakeBody] = useState<Position[]>([
    {
      x: 0,
      y: 0,
    },
  ]);

  const resetGameState = () => {
    setDirection(undefined);
    setFoodPosition({
      x: randomPositionOnGrid({
        gridSize: SEGMENT_SIZE,
        threshold: canvasWidth!,
      }),
      y: randomPositionOnGrid({
        gridSize: SEGMENT_SIZE,
        threshold: canvasHeight!,
      }),
    });

    setSnakeBody([
      {
        x: randomPositionOnGrid({
          gridSize: SEGMENT_SIZE,
          threshold: canvasWidth!,
        }),
        y: randomPositionOnGrid({
          gridSize: SEGMENT_SIZE,
          threshold: canvasHeight!,
        }),
      },
    ]);
  };

  const [foodPosition, setFoodPosition] = useState<Position | undefined>();

  const snakeHeadPosition = snakeBody[snakeBody.length - 1];
  const { moveDown, moveUp, moveLeft, moveRight } = createSnakeMovement();

  useEffect(() => {
    if (!canvasHeight || !canvasWidth) {
      return;
    }
    setFoodPosition({
      x: randomPositionOnGrid({
        gridSize: SEGMENT_SIZE,
        threshold: canvasWidth,
      }),
      y: randomPositionOnGrid({
        gridSize: SEGMENT_SIZE,
        threshold: canvasHeight,
      }),
    });

    setSnakeBody([
      {
        x: randomPositionOnGrid({
          gridSize: SEGMENT_SIZE,
          threshold: canvasWidth,
        }),
        y: randomPositionOnGrid({
          gridSize: SEGMENT_SIZE,
          threshold: canvasHeight,
        }),
      },
    ]);
  }, [canvasHeight, canvasWidth]);

  const onKeyDownHandler = (event: React.KeyboardEvent<HTMLDivElement>) => {
    switch (event.code) {
      case 'KeyS':
        if (direction !== Direction.UP) {
          setDirection(Direction.DOWN);
        }
        break;
      case 'KeyW':
        if (direction !== Direction.DOWN) {
          setDirection(Direction.UP);
        }
        break;
      case 'KeyD':
        if (direction !== Direction.LEFT) {
          setDirection(Direction.RIGHT);
        }
        break;
      case 'KeyA':
        if (direction !== Direction.RIGHT) {
          setDirection(Direction.LEFT);
        }
        break;
    }
  };

  const moveSnake = () => {
    let snakeBodyAfterMovement: Position[] | undefined;
    switch (direction) {
      case Direction.UP:
        if (snakeHeadPosition.y > 0) {
          snakeBodyAfterMovement = moveUp(snakeBody);
        } else if (canvasWidth && snakeHeadPosition.x > canvasWidth / 2) {
          setDirection(Direction.LEFT);
        } else {
          setDirection(Direction.RIGHT);
        }
        break;
      case Direction.DOWN:
        if (canvasHeight && snakeHeadPosition.y < canvasHeight - SEGMENT_SIZE) {
          snakeBodyAfterMovement = moveDown(snakeBody);
        } else if (canvasWidth && snakeHeadPosition.x > canvasWidth / 2) {
          setDirection(Direction.LEFT);
        } else {
          setDirection(Direction.RIGHT);
        }

        break;
      case Direction.LEFT:
        if (snakeHeadPosition.x > 0) {
          snakeBodyAfterMovement = moveLeft(snakeBody);
        } else if (canvasHeight && snakeHeadPosition.y < canvasHeight / 2) {
          setDirection(Direction.DOWN);
        } else {
          setDirection(Direction.UP);
        }
        break;
      case Direction.RIGHT:
        if (canvasWidth && snakeHeadPosition.x < canvasWidth - SEGMENT_SIZE) {
          snakeBodyAfterMovement = moveRight(snakeBody);
        } else if (canvasHeight && snakeHeadPosition.y < canvasHeight / 2) {
          setDirection(Direction.DOWN);
        } else {
          setDirection(Direction.UP);
        }
        break;
    }

    //snake eats itself
    if (snakeBodyAfterMovement) {
      const isGameOver = hasSnakeEatenItself(snakeBodyAfterMovement);
      if (isGameOver) {
        onGameOver();
      }
    }

    if (
      direction !== undefined &&
      foodPosition &&
      willSnakeHitTheFood({
        foodPosition,
        snakeHeadPosition,
        direction,
      })
    ) {
      setSnakeBody([
        ...snakeBodyAfterMovement!,
        { x: foodPosition.x, y: foodPosition.y },
      ]);

      setFoodPosition({
        x: randomPositionOnGrid({
          threshold: canvasWidth!,
        }),
        y: randomPositionOnGrid({ threshold: canvasHeight! }),
      });
    } else if (snakeBodyAfterMovement) {
      setSnakeBody(snakeBodyAfterMovement);
    }
  };

  useInterval(
    moveSnake,
    gameState === GameState.RUNNING ? MOVEMENT_SPEED : null
  );

  return {
    snakeBody,
    onKeyDownHandler,
    foodPosition,
    resetGameState,
  };
};

export default useGameLogic;
