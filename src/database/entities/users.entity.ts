import { RoleEnum } from "src/enums/role.enum";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from "typeorm";

@Entity('users') // Nome da tabela
export class Users {
    @PrimaryGeneratedColumn('uuid') // Define como chave primária com UUID
    uniqueId: string;

    @Column({ type: 'varchar', length: 64, nullable: false }) // Campo obrigatório com limite de 64 caracteres
    name: string;

    @Column({ type: 'varchar', length: 64, unique: true }) // Campo único e obrigatório
    email: string;

    @Column({ type: 'varchar', length: 64}) // Campo obrigatório
    password: string;

    @Column({ type: 'enum', enum: RoleEnum}) // Campo ENUM obrigatório
    role: RoleEnum;

    @Column({ type: 'boolean', default: true }) // Campo booleano com valor padrão
    isActive: boolean;

    @Column({ type: 'int', default: 0 }) // Campo inteiro com valor padrão
    jewels: number;

    @CreateDateColumn({ type: 'date', default: () => 'CURRENT_DATE' }) // Data de criação padrão para o dia atual
    createdAt: Date;

    @UpdateDateColumn({ type: 'date', default: () => 'CURRENT_DATE' }) // Data de atualização padrão para o dia atual
    updatedAt: Date;

    @DeleteDateColumn({ type: 'date', nullable: true }) // Data de exclusão lógica
    deletedAt: Date | null;
}
