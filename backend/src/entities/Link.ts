import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, Relation } from "typeorm";
import { Click } from "./Click.js";
import { Tenant } from "./Tenant.js";

@Entity()
export class Link {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "uuid" })
  tenant_id!: string;

  @Column({ type: "varchar" })
  title!: string;

  @Column({ type: "varchar" })
  url!: string;

  @Column({ type: "int", default: 0 })
  order_index!: number;

  @ManyToOne(() => Tenant, (tenant) => tenant.links, { onDelete: "CASCADE" })
  @JoinColumn({ name: "tenant_id" })
  tenant!: Relation<Tenant>;

  @OneToMany(() => Click, (click) => click.link)
  clicks!: Relation<Click[]>;
}
