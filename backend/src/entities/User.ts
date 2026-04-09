import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, Relation } from "typeorm";
import { Tenant } from "./Tenant.js";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", unique: true })
  email!: string;

  @Column({ type: "varchar" })
  password!: string;

  @Column({ type: "varchar", unique: true })
  username!: string;

  @Column({ type: "uuid" })
  tenant_id!: string;

  @OneToOne(() => Tenant, (tenant) => tenant.user, { onDelete: "CASCADE" })
  @JoinColumn({ name: "tenant_id" })
  tenant!: Relation<Tenant>;
}
