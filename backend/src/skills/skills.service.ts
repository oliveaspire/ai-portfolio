import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';

@Injectable()
export class SkillsService {
  constructor(private prisma: PrismaService) {}

  create(createSkillDto: CreateSkillDto) {
    return this.prisma.skill.create({
      data: createSkillDto,
    });
  }

  findAll() {
    return this.prisma.skill.findMany({
      orderBy: { level: 'desc' },
    });
  }

  async findOne(id: string) {
    const skill = await this.prisma.skill.findUnique({
      where: { id },
    });
    if (!skill) {
      throw new NotFoundException(`Skill with ID ${id} not found`);
    }
    return skill;
  }

  async update(id: string, updateSkillDto: UpdateSkillDto) {
    try {
      return await this.prisma.skill.update({
        where: { id },
        data: updateSkillDto,
      });
    } catch (error) {
      throw new NotFoundException(`Skill with ID ${id} not found`);
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.skill.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Skill with ID ${id} not found`);
    }
  }
}
