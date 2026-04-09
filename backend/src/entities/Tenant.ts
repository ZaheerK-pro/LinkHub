import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn, Relation } from "typeorm";
import { Link } from "./Link.js";
import { User } from "./User.js";

@Entity()
export class Tenant {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", unique: true })
  name!: string;

  @Column({ type: "jsonb", default: {} })
  theme!: Record<string, string>;

  @OneToOne(() => User, (user) => user.tenant)
  user!: Relation<User>;

  @OneToMany(() => Link, (link) => link.tenant)
  links!: Relation<Link[]>;
}
