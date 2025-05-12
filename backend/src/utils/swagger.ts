import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SPYBOTTLES Inventory API',
      version: '1.0.0',
      description: 'API documentation for BarVoice backend',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['src/**/*.ts'],
};

const swaggerSpec = swaggerJSDoc(options);

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - brand
 *         - category
 *         - location   
 *       properties:
 *         _id:
 *           type: string
 *         userId:
 *           type: string
 *         brand:
 *           type: string
 *         variant:
 *           type: string
 *           example: "Mandarin"
 *         category:
 *           type: string
 *           enum: [wine, spirit, beer, other]
 *           example: "spirit"
 *         varietal:
 *           type: string
 *         appellation:
 *           type: string
 *           example: "Napa Valley"
 *         vintage:
 *           type: number
 *         size_ml:
 *           type: number
 *         unit:
 *           type: string
 *           example: "bottle"
 *         quantity_full:
 *           type: number
 *         quantity_partial:
 *           type: number
 *         location:
 *           type: string
 *         notes:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
export { swaggerUi, swaggerSpec }; // ✅ Proper export of both
