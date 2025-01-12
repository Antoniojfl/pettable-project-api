CREATE TABLE public.pets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,  
    name VARCHAR(255) NOT NULL,                     
    type VARCHAR(50) NOT NULL,                      
    age INTEGER CHECK (age >= 0),                   
    owner_name VARCHAR(255) NOT NULL,               
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    deleted_at TIMESTAMP                            
);

CREATE INDEX idx_pets_id ON public.pets (id);
CREATE INDEX idx_pets_type ON public.pets (type);

-- updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = CURRENT_TIMESTAMP;
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
BEFORE UPDATE ON public.pets
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

--INSERT SAMPLE DATA --

INSERT INTO public.pets (id, name, type, age, owner_name)
VALUES
    (gen_random_uuid(), 'Bella', 'dog', 3, 'John Doe'),
    (gen_random_uuid(), 'Max', 'dog', 5, 'Jane Smith'),
    (gen_random_uuid(), 'Luna', 'cat', 2, 'Alice Johnson'),
    (gen_random_uuid(), 'Charlie', 'rabbit', 1, 'Bob Brown'),
    (gen_random_uuid(), 'Lucy', 'dog', 4, 'Karen Davis'),
    (gen_random_uuid(), 'Daisy', 'cat', 3, 'Michael Wilson'),
    (gen_random_uuid(), 'Milo', 'hamster', 1, 'Emily Clark'),
    (gen_random_uuid(), 'Rocky', 'dog', 7, 'Chris Taylor'),
    (gen_random_uuid(), 'Coco', 'cat', 4, 'David Martinez'),
    (gen_random_uuid(), 'Bailey', 'dog', 6, 'Sophia White'),
    (gen_random_uuid(), 'Lola', 'cat', 4, 'James Harris'),
    (gen_random_uuid(), 'Toby', 'rabbit', 2, 'Maria Lewis'),
    (gen_random_uuid(), 'Oscar', 'dog', 8, 'Patricia Hall'),
    (gen_random_uuid(), 'Ruby', 'cat', 3, 'George King'),
    (gen_random_uuid(), 'Buddy', 'dog', 2, 'Amanda Wright'),
    (gen_random_uuid(), 'Jack', 'rabbit', 4, 'Steven Scott'),
    (gen_random_uuid(), 'Molly', 'cat', 6, 'Kimberly Adams'),
    (gen_random_uuid(), 'Leo', 'dog', 3, 'Andrew Evans'),
    (gen_random_uuid(), 'Chloe', 'hamster', 1, 'Nancy Rivera'),
    (gen_random_uuid(), 'Zoe', 'rabbit', 3, 'Richard Young');


-------------------INSERT FUNCTION ------------------

DROP FUNCTION insert_pet(character varying,character varying,integer,character varying);
CREATE OR REPLACE FUNCTION insert_pet(
    pet_name VARCHAR(255),
    pet_type VARCHAR(50),
    pet_age INTEGER,
    owner VARCHAR(255)
) RETURNS TABLE(newid UUID) AS $$
BEGIN
    RETURN QUERY
    INSERT INTO public.pets (name, type, age, owner_name)
    VALUES (pet_name, pet_type, pet_age, owner)
    RETURNING id;
END;
$$ LANGUAGE plpgsql;

------------------- UPDATE FUNCTION--------------------

CREATE OR REPLACE FUNCTION update_pet_by_id(
    pet_id UUID,
    pet_name VARCHAR(255) DEFAULT NULL,
    pet_type VARCHAR(50) DEFAULT NULL,
    pet_age INTEGER DEFAULT NULL,
    owner VARCHAR(255) DEFAULT NULL
) RETURNS VOID AS $$
BEGIN
    UPDATE public.pets
    SET
        name = COALESCE(pet_name, name),
        type = COALESCE(pet_type, type),
        age = COALESCE(pet_age, age),
        owner_name = COALESCE(owner, owner_name)
    WHERE id = pet_id;
END;
$$ LANGUAGE plpgsql;

------------------- GET BY ID --------------------

drop function if EXISTS get_pet_by_id(pet_id UUID);
CREATE OR REPLACE FUNCTION get_pet_by_id(pet_id UUID)
RETURNS TABLE(id UUID, name VARCHAR, type VARCHAR, age INTEGER, owner_name VARCHAR) AS $$
BEGIN
    RETURN QUERY
    SELECT p.id, p.name, p.type, p.age, p.owner_name
    FROM public.pets p
    WHERE p.id = pet_id;
END;
$$ LANGUAGE plpgsql;

------------------- DELETE BY ID --------------------

CREATE OR REPLACE FUNCTION delete_pet_by_id(pet_id UUID)
RETURNS VOID AS $$
BEGIN
    DELETE FROM public.pets p
    WHERE p.id = pet_id;
END;
$$ LANGUAGE plpgsql;


-- view_total_pets_by_type
CREATE OR REPLACE VIEW view_total_pets_by_type AS
SELECT 
    type, 
    COUNT(*) AS total_pets
FROM 
    public.pets
WHERE deleted_at IS NULL 
GROUP BY 
    type
ORDER BY 
    total_pets DESC;

-- View: max and min age by type
CREATE OR REPLACE VIEW view_age_range_by_type AS
SELECT 
    type, 
    MAX(age) AS max_age, 
    MIN(age) AS min_age
FROM 
    public.pets
WHERE deleted_at IS NULL 
GROUP BY 
    type;


-- View: average age by type
CREATE OR REPLACE VIEW view_average_age_by_type AS
SELECT 
    type, 
    ROUND(AVG(age), 2) AS average_age
FROM 
    public.pets
WHERE deleted_at IS NULL 
GROUP BY 
    type
ORDER BY 
    type;
