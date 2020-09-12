export const createAPIAction = (
  actionName: string
): {
  REQUEST: string;
  SUCCESS: string;
  FAILURE: string;
} => ({
  REQUEST: `${actionName}_REQUEST`,
  SUCCESS: `${actionName}_SUCCESS`,
  FAILURE: `${actionName}_FAILURE`,
});
