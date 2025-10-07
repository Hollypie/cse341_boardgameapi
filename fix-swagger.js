const fs = require('fs');

// Read the generated swagger file
const swaggerFile = './swagger_output.json';
const swagger = JSON.parse(fs.readFileSync(swaggerFile, 'utf8'));

// Correct definitions
swagger.definitions = {
  Game: {
    type: 'object',
    properties: {
      title: {
        type: 'string',
        example: 'Memoir \'44'
      },
      publisher: {
        type: 'string',
        example: 'Days of Wonder'
      },
      yearPublished: {
        type: 'number',
        example: 2004
      },
      minPlayers: {
        type: 'number',
        example: 2
      },
      maxPlayers: {
        type: 'number',
        example: 2
      },
      playTime: {
        type: 'number',
        example: 60
      },
      complexity: {
        type: 'string',
        example: 'Medium'
      },
      genre: {
        type: 'string',
        example: 'Wargame, Scenario-based'
      },
      description: {
        type: 'string',
        example: 'A historical WWII board game.'
      },
      reviews: {
        type: 'array',
        items: {},
        example: []
      }
    }
  },
  Newgame: {
    type: 'object',
    properties: {
      title: {
        type: 'string',
        example: 'Monopoly'
      },
      publisher: {
        type: 'string',
        example: 'unknown'
      },
      yearPublished: {
        type: 'number',
        example: 1930
      },
      minPlayers: {
        type: 'number',
        example: 2
      },
      maxPlayers: {
        type: 'number',
        example: 5
      },
      playTime: {
        type: 'number',
        example: 200
      },
      complexity: {
        type: 'string',
        example: 'Easy'
      },
      genre: {
        type: 'string',
        example: 'economy'
      },
      description: {
        type: 'string',
        example: 'The worst board game.'
      },
      reviews: {
        type: 'array',
        items: {},
        example: []
      }
    }
  },
  User: {
    type: 'object',
    properties: {
      username: {
        type: 'string',
        example: 'holly'
      },
      email: {
        type: 'string',
        example: 'holly@example.com'
      },
      password: {
        type: 'string',
        example: 'securePassword123'
      }
    }
  },
  Review: {
    type: 'object',
    properties: {
      userId: {
        type: 'string',
        example: '68d539f99abd2a312f714648'
      },
      gameId: {
        type: 'string',
        example: '68d539a09abd2a312f714637'
      },
      rating: {
        type: 'number',
        example: 5
      },
      comment: {
        type: 'string',
        example: 'Love this game!'
      }
    }
  }
};

// Fix body parameters to reference definitions
function fixBodyParameters(paths) {
  for (const path in paths) {
    for (const method in paths[path]) {
      const endpoint = paths[path][method];
      
      if (endpoint.parameters) {
        endpoint.parameters.forEach(param => {
          if (param.in === 'body' && param.schema && param.schema.properties) {
            // Determine which definition to use based on tags, path, and method
            const props = Object.keys(param.schema.properties);
            const tags = endpoint.tags || [];
            
            // Check if endpoint is tagged with 'Newgame'
            if (tags.includes('Newgame')) {
              param.schema = { $ref: '#/definitions/Newgame' };
            }
            // Check for game-related properties
            else if (props.includes('title') && props.includes('publisher')) {
              param.schema = { $ref: '#/definitions/Game' };
            } 
            // Check for user-related properties
            else if (props.includes('username') && props.includes('email')) {
              param.schema = { $ref: '#/definitions/User' };
            } 
            // Check for review-related properties
            else if (props.includes('userId') && props.includes('gameId') && props.includes('rating')) {
              param.schema = { $ref: '#/definitions/Review' };
            }
          }
        });
      }
    }
  }
}

// Apply fixes
fixBodyParameters(swagger.paths);

// Write the corrected swagger back to file
fs.writeFileSync(swaggerFile, JSON.stringify(swagger, null, 2));
console.log('✅ Swagger file fixed successfully!');
console.log('- Corrected malformed definitions');
console.log('- Replaced body parameters with schema references');
console.log('- Applied Newgame schema to PUT /games/{id}');