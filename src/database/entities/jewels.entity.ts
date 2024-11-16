import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToMany,
  } from "typeorm";
  import { Users } from "./users.entity"; // Importa a entidade Users
  
  @Entity('jewels') // Nome da tabela
  export class Jewels {
    @PrimaryGeneratedColumn('uuid') // Define UniqueID como chave primária (UUID)
    uniqueId: string;
  
    @Column({ type: 'varchar', length: 64 }) // Nome, VARCHAR(64), NOT NULL
    name: string;
  
    @Column({ type: 'int' }) // Quantidade, NUMBER, NOT NULL
    quantity: number;
  
    @Column({ type: 'boolean' }) // IsAvailable, BOOLEAN, NOT NULL
    isAvailable: boolean;
  
    @ManyToMany(() => Users, (user) => user.jewels) // Relacionamento bidirecional
    users: Users[];
  
    @Column({ type: 'varchar', length: 50 }) // Tipo, ENUM representado como VARCHAR(50), NOT NULL
    type: string;
  
    @CreateDateColumn({ type: 'date', default: () => 'CURRENT_DATE' }) // Data de criação
    createdAt: Date;
  
    @UpdateDateColumn({ type: 'date', default: () => 'CURRENT_DATE' }) // Data de atualização
    updatedAt: Date;
  }
  