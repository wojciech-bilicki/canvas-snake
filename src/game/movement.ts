import { Direction, Position } from './useGameLogic';

const createSnakeMovement = (gridSize = 5) => ({
  moveRight: (snakeBody: Position[]) => {
    const bodyCopy = [...snakeBody];
    const headPos = bodyCopy[bodyCopy.length - 1];
    bodyCopy.shift();
    return [...bodyCopy, { ...headPos, x: headPos.x + gridSize }];
  },
  moveLeft: (snakeBody: Position[]) => {
    const bodyCopy = [...snakeBody];
    const headPos = bodyCopy[bodyCopy.length - 1];
    bodyCopy.shift();
    return [...bodyCopy, { ...headPos, x: headPos.x - gridSize }];
  },
  moveDown: (snakeBody: Position[]) => {
    const bodyCopy = [...snakeBody];
    const headPos = bodyCopy[bodyCopy.length - 1];
    bodyCopy.shift();
    return [...bodyCopy, { ...headPos, y: headPos.y + gridSize }];
  },
  moveUp: (snakeBody: Position[]) => {
    const bodyCopy = [...snakeBody];
    const headPos = bodyCopy[bodyCopy.length - 1];
    bodyCopy.shift();
    return [...bodyCopy, { ...headPos, y: headPos.y - gridSize }];
  },
});

interface WillSnakeHitTheFoodArgs {
  foodPosition: Position;
  snakeHeadPosition: Position;
  direction: Direction;
}

export const willSnakeHitTheFood = ({
  foodPosition,
  snakeHeadPosition,
  direction,
}: WillSnakeHitTheFoodArgs) => {
  switch (direction) {
    case Direction.UP:
      return (
        foodPosition.x === snakeHeadPosition.x &&
        snakeHeadPosition.y - 5 === foodPosition.y
      );
    case Direction.DOWN:
      return (
        foodPosition.x === snakeHeadPosition.x &&
        snakeHeadPosition.y + 5 === foodPosition.y
      );
    case Direction.LEFT:
      return (
        foodPosition.y === snakeHeadPosition.y &&
        snakeHeadPosition.x - 5 === foodPosition.x
      );

    case Direction.RIGHT:
      return (
        foodPosition.y === snakeHeadPosition.y &&
        snakeHeadPosition.x + 5 === foodPosition.x
      );
  }
};

export const hasSnakeEatenItself = (snakeBody: Position[]) => {
  if (snakeBody.length <= 1) {
    return false;
  }

  const head = snakeBody[snakeBody.length - 1];
  const body = snakeBody.slice(0, snakeBody.length - 1);

  return body.some((segment) => segment.x === head.x && segment.y === head.y);
};

export default createSnakeMovement;
