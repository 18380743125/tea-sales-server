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

@Entity()
export class Menu {
  @PrimaryGeneratedColumn({ comment: '菜单ID' })
  id: number;

  @Column({ length: 30, comment: '菜单名称' })
  name: string;

  @Column({ length: 50, comment: '菜单路径' })
  path: string;

  @Column({ comment: '排序等级' })
  order: number;

  @Column({ comment: '权限控制' })
  acl: string;

  @ManyToMany(() => Role, (role) => role.menus, {
    cascade: ['insert'],
  })
  @JoinTable({ name: 'role_menu' })
  role: Role;

  @CreateDateColumn({ comment: '创建时间' })
  createAt: Date;

  @UpdateDateColumn({ comment: '更新时间' })
  updateAt: Date;
}
