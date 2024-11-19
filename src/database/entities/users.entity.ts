import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    ManyToMany,
    JoinTable,
    BeforeInsert,
  } from "typeorm";
  import * as bcrypt from 'bcrypt'

  import { Jewels } from "./jewels.entity"; // Importa a entidade Jewels
  import { Products } from "./products.entity"; // Importa a entidade Products
  import { RoleEnum } from "src/enums/role.enum";
import { BadGatewayException } from "@nestjs/common";
  
  @Entity('users') // Nome da tabela
  export class Users {
    @PrimaryGeneratedColumn('uuid') // Define como chave primária com UUID
    uniqueId: string;
  
    @Column({ type: 'varchar', length: 64 }) // Nome, NOT NULL
    name: string;
  
    @Column({ type: 'varchar', length: 64, unique: true }) // Email único e NOT NULL
    email: string;
  
    @Column({ type: 'varchar', length: 64, select: false }) // Senha, NOT NULL
    password: string;
  
    @Column({ type: 'enum', enum: RoleEnum }) // Papel do usuário, ENUM, NOT NULL
    role: RoleEnum;
  
    @Column({ type: 'boolean', default: true }) // Status de ativo
    isActive: boolean;
  
    // Relacionamento com Jewels
    @ManyToMany(() => Jewels, (jewel) => jewel.users, { cascade: true }) // Relacionamento bidirecional com Jewels
    @JoinTable({ name: 'user_jewels' }) // Define a tabela intermediária
    jewels: Jewels[];
  
    // Relacionamento com Products
    @ManyToMany(() => Products, (product) => product.users, { cascade: true }) // Relacionamento bidirecional com Products
    @JoinTable({ name: 'user_products' }) // Define a tabela intermediária
    products: Products[];
  
    @CreateDateColumn({ type: 'date', default: () => 'CURRENT_DATE' }) // Data de criação
    createdAt: Date;
  
    @UpdateDateColumn({ type: 'date', default: () => 'CURRENT_DATE' }) // Data de atualização
    updatedAt: Date;
  
    @DeleteDateColumn({ type: 'date' }) // Data de exclusão lógica
    deletedAt: Date | null;

    @BeforeInsert()
        async hashPassword(){
            try{

                this.password = await bcrypt.hash(this.password,10);

            }catch (error){
                console.error(error)
                throw new BadGatewayException("Error  trying to hash password")
            }
        }
  }
  