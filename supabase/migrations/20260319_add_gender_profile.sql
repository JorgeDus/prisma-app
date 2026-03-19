-- Agregar campos de género a la tabla perfiles
ALTER TABLE public.profiles 
ADD COLUMN gender text CHECK (gender IN ('mujer', 'hombre', 'no_binario', 'otro', 'prefiero_no_decirlo')),
ADD COLUMN custom_gender text;
