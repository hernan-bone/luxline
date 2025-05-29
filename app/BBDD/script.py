import openpyxl
import unicodedata
import json
import os

# Ruta del archivo XLSX (usa dobles barras invertidas)
file_path = "C:\\Users\\ivan.maidana\\Desktop\\LISTA DE PRECIOS 257 - LUXLINE-MATELSUD (2).xlsx"

def process_text(text):
    """
    Elimina acentos, reemplaza espacios y '/' por '_' y reduce dobles '_' a uno.
    Además, reemplaza saltos de línea ("\n") por ", ".
    """
    if text is None:
        return ""
    text = str(text).replace("\n", ", ")
    text = unicodedata.normalize('NFKD', text).encode('ASCII', 'ignore').decode('utf-8')
    text = text.replace("/", "_")
    text = text.replace(" ", "_")
    while "__" in text:
        text = text.replace("__", "_")
    return text

def get_cell_rgb(cell):
    """
    Retorna el código RGB de la celda (sin el canal alfa) en mayúsculas, o None.
    Por ejemplo, si openpyxl retorna 'FFBFBFBF', se devuelve 'BFBFBF'.
    """
    if cell.fill and cell.fill.fgColor and cell.fill.fgColor.rgb:
        rgb = cell.fill.fgColor.rgb
        if len(rgb) == 8:
            return rgb[2:].upper()  # quita el canal alfa
        else:
            return rgb.upper()
    return None

# Colores objetivo (sin '#' y en mayúsculas)
GROUP_COLOR = "BFBFBF"   # para celdas que definen el grupo
KEY_COLOR   = "1E4E79"   # para celdas que definen las keys

# Mapeo de keys: se mapean las palabras en español a inglés.
key_mapping = {
    "codigo": "code",
    "cod": "code",
    "descripcion": "description",
    "descripción": "description",
    "precio": "price",
    "pack.": "pack",
    "imagen": None,
    "img": None
}

# Función para obtener la carpeta de salida.
# Se usa "Archivos 00" como carpeta base; si ya existe, se crean carpetas nuevas progresivas.
def get_output_folder():
    base = "Archivos 00"
    if not os.path.exists(base):
        os.makedirs(base)
        return base
    else:
        i = 1
        while True:
            folder_name = f"Archivos {str(i).zfill(2)}"
            if not os.path.exists(folder_name):
                os.makedirs(folder_name)
                return folder_name
            i += 1

# Cargar el libro de Excel y seleccionar la hoja activa
wb = openpyxl.load_workbook(file_path, data_only=True)
sheet = wb.active

min_row = 383
max_row = 473

groups = []         # Almacenará los grupos detectados
current_group = None
header_keys = {}    # Mapeo: índice de columna → key (definida en la fila de keys)
product_counter = 0
# Para grupos sin código numérico válido, se usa un contador base
group_counter = 200000

for row in sheet.iter_rows(min_row=min_row, max_row=max_row):
    first_cell = row[0]
    # Si la primera celda tiene fondo GROUP_COLOR, se interpreta como encabezado de un grupo.
    if get_cell_rgb(first_cell) == GROUP_COLOR:
        if current_group:
            groups.append(current_group)
        processed = process_text(first_cell.value)
        # Si el texto es numérico y de 6 dígitos se usa; de lo contrario se asigna un código secuencial.
        if processed.isdigit() and len(processed) == 6:
            group_img = processed
        else:
            group_img = str(group_counter)
            group_counter += 1
        current_group = {
            "img": group_img,
            "objects": [],
            "group_name": processed  # se usará para nombrar el archivo
        }
        header_keys = {}
        product_counter = 1
        continue

    # Si alguna celda de la fila tiene fondo KEY_COLOR, se toma la fila como de keys.
    is_header_row = any(get_cell_rgb(cell) == KEY_COLOR for cell in row)
    if is_header_row:
        header_keys = {}
        for idx, cell in enumerate(row):
            if get_cell_rgb(cell) == KEY_COLOR and cell.value is not None:
                raw_key = process_text(cell.value).lower()
                mapped_key = key_mapping.get(raw_key, raw_key)
                if mapped_key is not None:
                    header_keys[idx] = mapped_key
        continue

    # Si ya se han definido las keys y estamos dentro de un grupo, se procesa la fila como producto.
    if current_group and header_keys:
        # Verificar que al menos una de las celdas de las columnas definidas tenga dato.
        if not any((row[idx].value is not None and str(row[idx].value).strip() != "") for idx in header_keys):
            continue

        product = {}
        # Generar el código de imagen para el producto de forma uniforme:
        # Se genera en el formato "base-XXX", donde:
        # Se calcula la base como: int(group_img[0] + group_img[4:]).
        # Ejemplo: para grupo "200004", se toma: int("2" + "04") = 204.
        # Luego se asigna: f"{base}-{product_counter:03d}"
        group_img = current_group["img"]
        try:
            base = int(group_img[0] + group_img[4:])
        except:
            base = 0
        product_img = f"{base}-{product_counter:03d}"
        product["img"] = product_img
        product_counter += 1

        # Completar el resto de los campos usando las keys definidas.
        for idx, key in header_keys.items():
            if idx < len(row):
                cell_value = row[idx].value
                if cell_value is None or str(cell_value).strip() == "":
                    product[key] = "-"
                else:
                    # Si la key es "price", formatear el número con dos decimales y cambiar punto por coma.
                    if key == "price":
                        try:
                            num = float(cell_value)
                            val = "{:.2f}".format(num).replace(".", ",")
                        except:
                            val = str(cell_value).replace("\n", ", ")
                    # Si la key es "code", quitar .0 si es número entero.
                    elif key == "code":
                        try:
                            num = float(cell_value)
                            if num.is_integer():
                                val = str(int(num))
                            else:
                                val = str(num)
                        except:
                            val = str(cell_value).replace("\n", ", ")
                    # Si la key es "pack", quitar .0 si es número entero.
                    elif key == "pack":
                        try:
                            num = float(cell_value)
                            if num.is_integer():
                                val = str(int(num))
                            else:
                                val = str(num)
                        except:
                            val = str(cell_value).replace("\n", ", ")
                    else:
                        val = str(cell_value).replace("\n", ", ")
                    product[key] = val
            else:
                product[key] = "-"
        current_group["objects"].append(product)

# Agregar el último grupo detectado
if current_group:
    groups.append(current_group)

# Obtener la carpeta de salida.
output_folder = get_output_folder()
print("Archivos se generarán en la carpeta:", output_folder)

# Generar un archivo JSON por cada grupo, usando el nombre del grupo para el archivo.
for group in groups:
    output_data = {
        "img": group["img"],
        "objects": group["objects"]
    }
    filename = group["group_name"] + ".json"
    file_path_out = os.path.join(output_folder, filename)
    with open(file_path_out, "w", encoding="utf-8") as f:
        json.dump([output_data], f, indent=2, ensure_ascii=False)
    print("Archivo generado:", file_path_out)
