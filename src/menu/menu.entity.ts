import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from '../role/role.entity';
import { Expose } from "class-transformer";

@Entity()
export class Menu {
  @PrimaryGeneratedColumn({ comment: '菜单ID' })
  @Expose()
  id: number;

  @Column({ length: 30, comment: '菜单名称' })
  @Expose()
  name: string;

  @Column({ length: 50, comment: '菜单路径' })
  @Expose()
  path: string;

  @Column({ comment: '排序等级' })
  @Expose()
  order: number;

  @Column({ comment: '权限控制' })
  @Expose()
  acl: string;

  @ManyToMany(() => Role, (role) => role.menus, {
    cascade: ['insert'],
  })
  @JoinTable({ name: 'role_menu' })
  @Expose()
  role: Role;

  @CreateDateColumn({ comment: '创建时间' })
  @Expose()
  createAt: Date;

  @UpdateDateColumn({ comment: '更新时间' })
  @Expose()
  updateAt: Date;
}
