import axios, { AxiosInstance } from "axios";
import { BadGatewayException, NotFoundException } from "@nestjs/common";

type ProductSnapshot = {
  id: string;
  price: number;
};

export class ProductCatalogClient {
  private readonly client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL:
        process.env.PRODUCT_SERVICE_URL ||
        process.env.PRODUCT_SERVICE_BASE_URL ||
        "http://product-service:3002",
      timeout: 5000,
    });
  }

  async getProductSnapshot(productId: string): Promise<ProductSnapshot> {
    try {
      const response = await this.client.get(`/products/${productId}`);
      const product = response.data?.data || response.data;

      if (!product || typeof product.price === "undefined") {
        throw new BadGatewayException("Product service returned invalid payload");
      }

      return {
        id: String(product._id || product.id || productId),
        price: Number(product.price),
      };
    } catch (error: any) {
      if (error?.response?.status === 404) {
        throw new NotFoundException("Product not found");
      }

      if (error instanceof NotFoundException || error instanceof BadGatewayException) {
        throw error;
      }

      throw new BadGatewayException("Failed to fetch product snapshot");
    }
  }
}