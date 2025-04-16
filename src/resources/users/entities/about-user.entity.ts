import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "./user.entity";

enum visibility {
  everyone = "everyone",
  teachers = "teachers",
  hidden = "hidden",
}

@Entity()
export class AboutUserEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @OneToOne(() => UserEntity)
  user: UserEntity;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  surname: string;

  @Column({ nullable: true })
  patronymic: string;

  @Column({ nullable: true })
  birthday: Date;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ nullable: true })
  banner: string; // Новый: путь к баннеру

  @Column({ nullable: true })
  background: string; // Новый: путь к тайловому фону

  @Column({ nullable: true, default: "#6D5CE8" })
  accentColor: string; // Новый: акцентный цвет

  @Column({ nullable: true, default: "#FFFFFF" })
  accentTextColor: string; // Новый: акцентный цвет текста

  @Column({ default: visibility.teachers, nullable: true })
  emailVisible: visibility;

  @Column({ nullable: true })
  signature: string;
}