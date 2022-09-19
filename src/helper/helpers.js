const StatusCodes = {
  ACCEPTED: 202,
  BAD_GATEWAY: 502,
  BAD_REQUEST: 400,
  CONFLICT: 409,
  CONTINUE: 100,
  CREATED: 201,
  EXPECTATION_FAILED: 417,
  FAILED_DEPENDENCY: 424,
  FORBIDDEN: 403,
  GATEWAY_TIMEOUT: 504,
  GONE: 410,
  HTTP_VERSION_NOT_SUPPORTED: 505,
  IM_A_TEAPOT: 418,
  INSUFFICIENT_SPACE_ON_RESOURCE: 419,
  INSUFFICIENT_STORAGE: 507,
  INTERNAL_SERVER_ERROR: 500,
  LENGTH_REQUIRED: 411,
  LOCKED: 423,
  METHOD_FAILURE: 420,
  METHOD_NOT_ALLOWED: 405,
  MOVED_PERMANENTLY: 301,
  MOVED_TEMPORARILY: 302,
  MULTI_STATUS: 207,
  MULTIPLE_CHOICES: 300,
  NETWORK_AUTHENTICATION_REQUIRED: 511,
  NO_CONTENT: 204,
  NON_AUTHORITATIVE_INFORMATION: 203,
  NOT_ACCEPTABLE: 406,
  NOT_FOUND: 404,
  NOT_IMPLEMENTED: 501,
  NOT_MODIFIED: 304,
  OK: 200,
  PARTIAL_CONTENT: 206,
  PAYMENT_REQUIRED: 402,
  PERMANENT_REDIRECT: 308,
  PRECONDITION_FAILED: 412,
  PRECONDITION_REQUIRED: 428,
  PROCESSING: 102,
  PROXY_AUTHENTICATION_REQUIRED: 407,
  REQUEST_HEADER_FIELDS_TOO_LARGE: 431,
  REQUEST_TIMEOUT: 408,
  REQUEST_TOO_LONG: 413,
  REQUEST_URI_TOO_LONG: 414,
  REQUESTED_RANGE_NOT_SATISFIABLE: 416,
  RESET_CONTENT: 205,
  SEE_OTHER: 303,
  SERVICE_UNAVAILABLE: 503,
  SWITCHING_PROTOCOLS: 101,
  TEMPORARY_REDIRECT: 307,
  TOO_MANY_REQUESTS: 429,
  UNAUTHORIZED: 401,
  UNAVAILABLE_FOR_LEGAL_REASONS: 451,
  UNPROCESSABLE_ENTITY: 422,
  UNSUPPORTED_MEDIA_TYPE: 415,
  USE_PROXY: 305,
  MISDIRECTED_REQUEST: 421,
};

const StatusMessages = {
  ACCEPTED: "Accepted",
  BAD_GATEWAY: "Bad Gateway",
  BAD_REQUEST: "Bad Request",
  CONFLICT: "Conflict",
  CONTINUE: "Continue",
  CREATED: "Created",
  EXPECTATION_FAILED: "Expectation Failed",
  FAILED_DEPENDENCY: "Failed Dependency",
  FORBIDDEN: "Forbidden",
  GATEWAY_TIMEOUT: "Gateway Timeout",
  GONE: "Gone",
  HTTP_VERSION_NOT_SUPPORTED: "HTTP Version Not Supported",
  IM_A_TEAPOT: "I'm a teapot",
  INSUFFICIENT_SPACE_ON_RESOURCE: "Insufficient Space on Resource",
  INSUFFICIENT_STORAGE: "Insufficient Storage",
  INTERNAL_SERVER_ERROR: "Internal Server Error",
  LENGTH_REQUIRED: "Length Required",
  LOCKED: "Locked",
  METHOD_FAILURE: "Method Failure",
  METHOD_NOT_ALLOWED: "Method Not Allowed",
  MOVED_PERMANENTLY: "Moved Permanently",
  MOVED_TEMPORARILY: "Moved Temporarily",
  MULTI_STATUS: "Multi-Status",
  MULTIPLE_CHOICES: "Multiple Choices",
  NETWORK_AUTHENTICATION_REQUIRED: "Network Authentication Required",
  NO_CONTENT: "No Content",
  NON_AUTHORITATIVE_INFORMATION: "Non Authoritative Information",
  NOT_ACCEPTABLE: "Not Acceptable",
  NOT_FOUND: "Not Found",
  NOT_IMPLEMENTED: "Not Implemented",
  NOT_MODIFIED: "Not Modified",
  OK: "OK",
  PARTIAL_CONTENT: "Partial Content",
  PAYMENT_REQUIRED: "Payment Required",
  PERMANENT_REDIRECT: "Permanent Redirect",
  PRECONDITION_FAILED: "Precondition Failed",
  PRECONDITION_REQUIRED: "Precondition Required",
  PROCESSING: "Processing",
  PROXY_AUTHENTICATION_REQUIRED: "Proxy Authentication Required",
  REQUEST_HEADER_FIELDS_TOO_LARGE: "Request Header Fields Too Large",
  REQUEST_TIMEOUT: "Request Timeout",
  REQUEST_TOO_LONG: "Request Entity Too Large",
  REQUEST_URI_TOO_LONG: "Request-URI Too Long",
  REQUESTED_RANGE_NOT_SATISFIABLE: "Requested Range Not Satisfiable",
  RESET_CONTENT: "Reset Content",
  SEE_OTHER: "See Other",
  SERVICE_UNAVAILABLE: "Service Unavailable",
  SWITCHING_PROTOCOLS: "Switching Protocols",
  TEMPORARY_REDIRECT: "Temporary Redirect",
  TOO_MANY_REQUESTS: "Too Many Requests",
  UNAUTHORIZED: "Unauthorized",
  UNAVAILABLE_FOR_LEGAL_REASONS: "Unavailable For Legal Reasons",
  UNPROCESSABLE_ENTITY: "Unprocessable Entity",
  UNSUPPORTED_MEDIA_TYPE: "Unsupported Media Type",
  USE_PROXY: "Use Proxy",
  MISDIRECTED_REQUEST: "Misdirected Request",
  EMAIL_ALREADY: "you have already registered this ",
  USER_CREATE: "User Created Successefully",
  USER_DELETE: "User Deleted Successefully",
};

const privilage = [
  {
    name: "READ",
    description: "only for read permission",
    accessNumber: 1,
  },
  {
    name: "ADD",
    description: "only for created permission",
    accessNumber: 2,
  },
  {
    name: "UPDATE",
    description: "only for update permission",
    accessNumber: 4,
  },
  {
    name: "DELETE",
    description: "only for delete permission",
    accessNumber: 8,
  },
];
const privilageRole = [
  {
    module: [
      {
        name: "products",
        privilageNumber: 15,
      },
      {
        name: "acutions",
        privilageNumber: 15,
      },
      {
        name: "roles",
        privilageNumber: 15,
      },
      {
        name: "users",
        privilageNumber: 15,
      },
    ],
  },
];
const privilageRoleVan = [
  {
    module: [
      {
        name: "products",
        privilageNumber: 7,
      },
      {
        name: "acutions",
        privilageNumber: 7,
      },
      {
        name: "roles",
        privilageNumber: 7,
      },
      {
        name: "users",
        privilageNumber: 7,
      },
    ],
  },
];

const roles = [{ name: "Admin" }, { name: "Vendor" }];

const productCategory = [
  {
    name: "mobile",
    description:
      "three categories of mobile phones: basic phones, feature phones, and smartphones.",
  },
  {
    name: "car",
    description:
      "car body types: Hatchback, Sedan, SUV, MUV, Coupe, Convertible, and Pickup Truck.",
  },
];
const auctionCategory = [
  {
    name: "Apple",
    description:
      "The iPhone 14 and iPhone 14 Plus are smartphones designed, developed, and marketed by Apple Inc. They are the sixteenth generation.",
  },
  {
    name: "huawei",
    description: "This list contains 275 Huawei Mobile Phones in India.",
  },
];
export const helpers = {
  StatusMessages,
  StatusCodes,
  privilage,
  roles,
  privilageRole,
  privilageRoleVan,
  productCategory,
  auctionCategory,
};
