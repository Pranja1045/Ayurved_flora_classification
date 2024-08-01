from tensorflow.keras.applications.imagenet_utils import preprocess_input
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import numpy as np
import cv2

# Path to the model file
MODEL_PATH = 'D:/python_programming/Ayurved_image_classification/models/my_model_ResNet.h5'
# Load the model
model = load_model(MODEL_PATH)
class_names = ['Aloevera-Aloe barbadensis', 'Amaranthus Green_Amaranthus viridis', 'Amaranthus Red_Amaranthus tricolor', 'Amla-Phyllanthus emlica Linn', 'Amruta Balli-Tinospora cordifolia', 
               'Arali-Nerium oleander', 'Arive_Dantu_Amaranthus viridis', 'Ashoka-Saraca asoca', 'Ashwagandha_Withania somnifera', 'Asthma plant_Euphorbia hirta', 'Astma_weed', 
               'Avacado_Persea americana', 'Avaram_Senna auriculata', 'Badipala', 'Balloon vine_Cardiospermum halicacabum', 'Bamboo-Bambusoideae', 'Basale_Basella alba', 'Beans-Vigna spp. (Genus) or Phaseolus spp. (Genus)', 'Bellyache bush (Green)_Jatropha gossypiifolia', 'Benghal dayflower_ Commelina benghalensis', 'Betel-Piper betle', 'Betel_Nut_Areca catechu', 'Big Caltrops_Tribulus terrestris', 'Black-Honey Shrub_Tribulus terrestris', 'Brahmi-Bacopa monnieri', 'Bringaraja-Eclipta prostrata', 
               'Bristly Wild Grape_Cissus quadrangularis', 'Butterfly Pea_Clitoria ternatea', 'Camphor-Cinnamomum camphora', 'Cape Gooseberry_Physalis peruviana', 'Cardiospermum halicacabum', 
               'Caricature', 'Castor-Ricinus communis', 'Catharanthus', 'Celery_Apium graveolens', 'Chakte', 'Chilly-Capsicum spp. (Genus)', 'Chinese Spinach_Amaranthus dubius',
               'Citron lime (herelikai)-Citrus medica (Citron) or Citrus aurantiifolia (Lime)', 'Coffee-Coffea spp. (Genus)', 'Common Wireweed_Sida rhombifolia', 
               'Common rue(naagdalli)- Ruta graveolens', 'Coriander-Coriandrum sativum', 'Country Mallow_Abutilon indicum', 'Crown flower_Calotropis gigantea', 
               'Curry Leaf-Murraya koenigii', 'Doddapatre-Plectanthus amboinicus', 'Drumstick- Moringa oleifera', 'Dwarf Copperleaf (Green)_Acalypha reptans', 'Dwarf copperleaf (Red)_ Acalypha wilkesiana', 
               'Ekka-Calotropis gigantea', 'Eucalyptus-Eucalyptus spp. (Genus)', 'False Amarnath_Digera muricata', 'Fenugreek Leaves_ Trigonella foenum-graecum']


def process_image(image_path):
    img = image.load_img(image_path, target_size=(100, 100))  # Resize to the required input size
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)  # Add batch dimension
    img_array = preprocess_input(img_array)  # Preprocess for the specific model
    return img_array


def test_model_prediction(image_path,class_names):
    processed_image = process_image(image_path)
    prediction = model.predict(processed_image)
    class_id =prediction.argmax()
    print(class_id)
    print(len(class_names))
    return class_names[class_id]

print(test_model_prediction('D:/python_programming/Ayurved_image_classification/uploads/crown_flower.jpeg',class_names))