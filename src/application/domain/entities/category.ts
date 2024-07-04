import { Entity } from "../../core/entities/entity";

export interface CategoryProps {
  name: string;
}

export class Category extends Entity<CategoryProps> {
  get name() {
    return this.props.name;
  }

  static create(props: CategoryProps, id?: string) {
    const category = new Category(
      {
        ...props,
      },
      id
    );

    return category;
  }
}