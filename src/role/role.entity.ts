import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Expose } from "class-transformer";

import { Menu } from '../menu/menu.entity';
import { User } from '../user/user.entity';

@Entity()
export class Role {
  @PrimaryGeneratedColumn({ comment: '角色ID' })
  @Expose()
  id: number;

  @Column({ unique: true, length: 30, comment: '角色名称' })
  @Expose()
  name: string;

  @ManyToMany(() => Menu, (menu) => menu.role)
  @Expose()
  menus: Menu[];

  @ManyToMany(() => User, (user) => user.roles)
  @Expose()
  users: User[];

  @CreateDateColumn({ comment: '创建时间' })
  @Expose()
  createAt: Date;

  @UpdateDateColumn({ comment: '更新时间' })
  @Expose()
  updateAt: Date;
}
