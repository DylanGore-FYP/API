export default {
  openapi: '3.0.3',
  info: {
    title: 'FYP API',
    version: '0.0.0',
    description: '',
    contact: {
      name: 'Github',
      url: 'https://github.com/DylanGore/FYP-API',
    },
  },
  servers: [
    {
      url: 'http://localhost:5000',
      description: 'Development server',
    },
  ],
  components: {
    // #/components/securitySchemas
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
      },
    },
    // #/components/parameters
    parameters: {
      role: {
        in: 'path',
        name: 'role',
        description: 'The name of the role',
        schema: {
          $ref: '#/components/schemas/role',
        },
      },
      uid: {
        in: 'path',
        name: 'uid',
        description: 'The unique identifier for a user',
        schema: {
          $ref: '#/components/schemas/uid',
        },
      },
    },
    // #/components/schemas
    schemas: {
      200: {
        description: 'OK',
      },
      401: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            description: 'The error message',
          },
          reason: {
            type: 'string',
            description: 'The reason the error was returned',
          },
        },
      },
      403: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            description: 'The error message',
            example: 'Forbidden',
          },
        },
      },
      500: {
        description: 'Internal server error',
      },
      role: {
        type: 'string',
        required: true,
        description: 'The name of the role',
        example: 'admin',
      },
      uid: {
        type: 'string',
        required: true,
        description: 'The unique identifier for a user',
      },
    },
    // #/components/examples
    examples: {
      NoToken: {
        message: 'You are not authorized to access this resource',
        reason: 'No token provided',
      },
      InvalidToken: {
        message: 'You are not authorized to access this resource',
        reason: 'Invalid token',
      },
      InvalidRole: {
        message: 'You are not authorized to access this resource',
        reason: 'Invalid role',
      },
    },
    // #/components/responses
    responses: {
      200: {
        $ref: '#/components/schemas/200',
      },
      401: {
        description: 'Unauthorized',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/401',
            },
            examples: {
              NoToken: {
                $ref: '#/components/examples/NoToken',
              },
              InvalidToken: {
                $ref: '#/components/examples/InvalidToken',
              },
              InvalidRole: {
                $ref: '#/components/examples/InvalidRole',
              },
            },
          },
        },
      },
      403: {
        description: 'Forbidden',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  description: 'The error message',
                  example: 'Forbidden',
                },
              },
            },
          },
        },
      },
      500: {
        $ref: '#/components/schemas/500',
      },
      vehicleList: {
        description: 'A list of vehicles',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                vehicles: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: {
                        type: 'integer',
                        description: 'The vehicle ID.',
                        example: 1,
                      },
                      registration: {
                        type: 'string',
                        description: 'The vehicle registration.',
                        example: '202-WX-1000',
                      },
                      manufacturer: {
                        type: 'string',
                        description: 'The vehicle manufacturer.',
                        example: 'Toyota',
                      },
                      model: {
                        type: 'string',
                        description: 'The vehicle model.',
                        example: 'Corolla',
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  paths: {
    // Default
    '/': {
      get: {
        tags: ['Default'],
        summary: 'The initial API endpoint',
        description: 'Returns the current API version',
        responses: {
          200: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    version: {
                      type: 'string',
                      example: 1,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    // Vehicles
    '/vehicles/all': {
      get: {
        tags: ['Vehicles'],
        summary: 'Get a list of all known vehicles',
        securtiy: [
          {
            bearerAuth: [],
          },
        ],
        responses: {
          200: {
            $ref: '#/components/responses/vehicleList',
          },
          401: {
            $ref: '#/components/responses/401',
          },
          403: {
            $ref: '#/components/responses/403',
          },
        },
      },
    },
    '/vehicles/{vehicleId}/tracking': {
      get: {
        tags: ['Vehicles'],
        summary: 'Get a list of location values for the specified vehicle',
        parameters: [
          {
            in: 'path',
            name: 'vehicleId',
            schema: {
              type: 'string',
            },
            required: true,
            description: 'The ID of the vehicle to get data for',
          },
        ],
        responses: {
          200: {
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      time: {
                        type: 'string',
                        description: 'The data timestamp',
                        example: '2020-12-08T13:35:44.810275457Z',
                      },
                      lat: {
                        type: 'number',
                        format: 'float',
                        description: 'The latitude value',
                        minimum: 0.0,
                        example: 52.2461,
                      },
                      lon: {
                        type: 'number',
                        format: 'float',
                        description: 'The longitude value',
                        example: 7.1387,
                        minimum: 0.0,
                      },
                    },
                  },
                },
              },
            },
          },
          401: {
            $ref: '#/components/responses/401',
          },
          403: {
            $ref: '#/components/responses/403',
          },
          500: {
            $ref: '#/components/responses/500',
          },
        },
      },
    },
    '/vehicles/{vehicleId}/{metric}': {
      get: {
        tags: ['Vehicles'],
        summary: 'Get a list of all values for a specific vehicle and metric',
        parameters: [
          {
            in: 'path',
            name: 'vehicleId',
            schema: {
              type: 'string',
            },
            required: true,
            description: 'The ID of the vehicle to get data for',
          },
          {
            in: 'path',
            name: 'metric',
            schema: {
              type: 'string',
            },
            required: true,
            description: 'The name of the metric',
          },
        ],
        responses: {
          200: {
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      time: {
                        type: 'string',
                        description: 'The data timestamp',
                        example: '2020-12-08T13:35:44.810275457Z',
                      },
                      field: {
                        type: 'string',
                        description: 'The data field to measure',
                        example: 'speed',
                      },
                      value: {
                        type: 'number',
                        format: 'float',
                        minimum: 0,
                        description: 'The value of the field',
                        example: 80,
                      },
                    },
                  },
                },
              },
            },
          },
          401: {
            $ref: '#/components/responses/401',
          },
          403: {
            $ref: '#/components/responses/403',
          },
        },
      },
    },
    // Authentication
    '/auth/users': {
      get: {
        tags: ['Authentication'],
        summary: 'Get a list of all known users',
        securtiy: [
          {
            bearerAuth: [],
          },
        ],
        responses: {
          200: {
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    type: 'object',
                    description: 'The Firebase user object. See the Firebase documentation for a full example.',
                    properties: {
                      uid: {
                        type: 'string',
                        example: 'f4192305F41923053dcd4CDDBEba',
                      },
                      email: {
                        type: 'string',
                        example: 'example@example.com',
                      },
                      emailVerified: {
                        type: 'boolean',
                        example: false,
                      },
                      displayName: {
                        type: 'string',
                        example: 'Example user',
                      },
                      photoURL: {
                        type: 'string',
                        example: 'http://example.com/avatar.png',
                      },
                      disabled: {
                        type: 'boolean',
                        example: false,
                      },
                      metadata: {
                        type: 'object',
                        example: {},
                      },
                    },
                  },
                },
              },
            },
          },
          401: {
            $ref: '#/components/responses/401',
          },
          403: {
            $ref: '#/components/responses/403',
          },
          500: {
            $ref: '#/components/responses/500',
          },
        },
      },
    },
    '/auth/users/:uid': {
      delete: {
        tags: ['Authentication'],
        summary: 'Delete a user by uid',
        securtiy: [
          {
            bearerAuth: [],
          },
        ],
        parameters: [
          {
            $ref: '#/components/parameters/uid',
          },
        ],
        responses: {
          200: {
            $ref: '#/components/responses/200',
          },
          401: {
            $ref: '#/components/responses/401',
          },
          403: {
            $ref: '#/components/responses/403',
          },
          500: {
            $ref: '#/components/responses/500',
          },
        },
      },
    },
    '/auth/users/:uid/enable': {
      put: {
        tags: ['Authentication'],
        summary: 'Enable a user by uid',
        securtiy: [
          {
            bearerAuth: [],
          },
        ],
        parameters: [
          {
            $ref: '#/components/parameters/uid',
          },
        ],
        responses: {
          200: {
            $ref: '#/components/responses/200',
          },
          401: {
            $ref: '#/components/responses/401',
          },
          403: {
            $ref: '#/components/responses/403',
          },
          500: {
            $ref: '#/components/responses/500',
          },
        },
      },
    },
    '/auth/users/:uid/disable': {
      put: {
        tags: ['Authentication'],
        summary: 'Disable a user by uid',
        securtiy: [
          {
            bearerAuth: [],
          },
        ],
        parameters: [
          {
            $ref: '#/components/parameters/uid',
          },
        ],
        responses: {
          200: {
            $ref: '#/components/responses/200',
          },
          401: {
            $ref: '#/components/responses/401',
          },
          403: {
            $ref: '#/components/responses/403',
          },
          500: {
            $ref: '#/components/responses/500',
          },
        },
      },
    },
    '/auth/roles/grant/:role/:uid': {
      put: {
        tags: ['Authentication'],
        summary: 'Give a user a new role',
        securtiy: [
          {
            bearerAuth: [],
          },
        ],
        parameters: [
          {
            $ref: '#/components/parameters/role',
          },
          {
            $ref: '#/components/parameters/uid',
          },
        ],
        responses: {
          200: {
            $ref: '#/components/responses/200',
          },
          401: {
            $ref: '#/components/responses/401',
          },
          403: {
            $ref: '#/components/responses/403',
          },
          500: {
            $ref: '#/components/responses/500',
          },
        },
      },
    },
    '/auth/roles/revoke/:role/:uid': {
      put: {
        tags: ['Authentication'],
        summary: 'Remove a role from a user',
        securtiy: [
          {
            bearerAuth: [],
          },
        ],
        parameters: [
          {
            $ref: '#/components/parameters/role',
          },
          {
            $ref: '#/components/parameters/uid',
          },
        ],
        responses: {
          200: {
            $ref: '#/components/responses/200',
          },
          401: {
            $ref: '#/components/responses/401',
          },
          403: {
            $ref: '#/components/responses/403',
          },
          500: {
            $ref: '#/components/responses/500',
          },
        },
      },
    },
  },
};
