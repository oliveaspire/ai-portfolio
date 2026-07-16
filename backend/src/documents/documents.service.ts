import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import * as fs from 'fs/promises';

@Injectable()
export class DocumentsService {
  constructor(private prisma: PrismaService) {}

  async saveFilesMetadata(files: Express.Multer.File[]) {
    const documents = [];
    for (const file of files) {
      const doc = await this.prisma.document.create({
        data: {
          name: file.filename,
          originalName: file.originalname,
          size: file.size,
          mimeType: file.mimetype,
          path: file.path,
        },
      });
      // Simulate indexing for AI by starting a timeout
      setTimeout(async () => {
        await this.prisma.document.update({
          where: { id: doc.id },
          data: { indexed: true },
        });
      }, 2000);
      documents.push(doc);
    }
    return documents;
  }

  async getDocuments() {
    return this.prisma.document.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async deleteDocument(id: string) {
    const doc = await this.prisma.document.findUnique({ where: { id } });
    if (!doc) {
      throw new NotFoundException('Document not found');
    }

    try {
      await fs.access(doc.path);
      await fs.unlink(doc.path);
    } catch (e) {
      console.warn(`File not found on disk: ${doc.path}`);
    }

    return this.prisma.document.delete({
      where: { id },
    });
  }
}
