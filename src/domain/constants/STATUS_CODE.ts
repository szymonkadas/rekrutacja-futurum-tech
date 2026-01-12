// It can be expanded as needed - so i think SCREAMING_SNAKE_CASE is fine if we allow for only expanding not modyfiying
const STATUS_CODE = {
  OK: 200,
  BAD_REQUEST: 400,
  PAYMENT_REQUIRED: 402,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;
export default STATUS_CODE;
