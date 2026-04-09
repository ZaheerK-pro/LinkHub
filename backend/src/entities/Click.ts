import { CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Relation } from "typeorm";
import { Link } from "./Link.js";

@Entity()
export class Click {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @ManyToOne(() => Link, (link) => link.clicks, { onDelete: "CASCADE" })
  @JoinColumn({ name: "link_id" })
  link!: Relation<Link>;

  @CreateDateColumn()
  created_at!: Date;
}
