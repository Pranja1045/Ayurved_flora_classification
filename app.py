from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
import os
import numpy as np
import cv2
from flask_cors import CORS
from tensorflow.keras.applications.resnet50 import preprocess_input
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image

# Path to the model file
MODEL_PATH = 'D:/python_programming/Ayurved_image_classification/models/my_model_ResNet.h5'
model = load_model(MODEL_PATH)

# Define class names (make sure this matches your model's class names)
class_names = ['Aloevera-Aloe barbadensis', 'Amaranthus Green_Amaranthus viridis', 'Amaranthus Red_Amaranthus tricolor', 'Amla-Phyllanthus emlica Linn', 'Amruta Balli-Tinospora cordifolia', 
               'Arali-Nerium oleander', 'Arive_Dantu_Amaranthus viridis', 'Ashoka-Saraca asoca', 'Ashwagandha_Withania somnifera', 'Asthma plant_Euphorbia hirta', 'Astma_weed', 
               'Avacado_Persea americana', 'Avaram_Senna auriculata', 'Badipala', 'Balloon vine_Cardiospermum halicacabum', 'Bamboo-Bambusoideae', 'Basale_Basella alba', 'Beans-Vigna spp. (Genus) or Phaseolus spp. (Genus)', 'Bellyache bush (Green)_Jatropha gossypiifolia', 'Benghal dayflower_ Commelina benghalensis', 'Betel-Piper betle', 'Betel_Nut_Areca catechu', 'Big Caltrops_Tribulus terrestris', 'Black-Honey Shrub_Tribulus terrestris', 'Brahmi-Bacopa monnieri', 'Bringaraja-Eclipta prostrata', 
               'Bristly Wild Grape_Cissus quadrangularis', 'Butterfly Pea_Clitoria ternatea', 'Camphor-Cinnamomum camphora', 'Cape Gooseberry_Physalis peruviana', 'Cardiospermum halicacabum', 
               'Caricature', 'Castor-Ricinus communis', 'Catharanthus', 'Celery_Apium graveolens', 'Chakte', 'Chilly-Capsicum spp. (Genus)', 'Chinese Spinach_Amaranthus dubius',
               'Citron lime (herelikai)-Citrus medica (Citron) or Citrus aurantiifolia (Lime)', 'Coffee-Coffea spp. (Genus)', 'Common Wireweed_Sida rhombifolia', 
               'Common rue(naagdalli)- Ruta graveolens', 'Coriander-Coriandrum sativum', 'Country Mallow_Abutilon indicum', 'Crown flower_Calotropis gigantea', 
               'Curry Leaf-Murraya koenigii', 'Doddapatre-Plectanthus amboinicus', 'Drumstick- Moringa oleifera', 'Dwarf Copperleaf (Green)_Acalypha reptans', 'Dwarf copperleaf (Red)_ Acalypha wilkesiana', 
               'Ekka-Calotropis gigantea', 'Eucalyptus-Eucalyptus spp. (Genus)', 'False Amarnath_Digera muricata', 'Fenugreek Leaves_ Trigonella foenum-graecum']

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'D:/python_programming/Ayurved_image_classification/uploads'
CORS(app, resources={r"/classify": {"origins": "http://localhost:5173"}})

def process_image(image_path):
    default_image_size = (100, 100)  # Match the size expected by your model
    img_ = cv2.imread(image_path)
    img = cv2.resize(img_, default_image_size)  # Resize to the required input size
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)  # Add batch dimension
      # Preprocess for the specific model
     # Normalize pixel values to [0, 1]
    return img_array

def classify_image(image_array, class_names):
    np_image_list = np.array(image_array, dtype=np.float16) / 225.0
    prediction = model.predict(np_image_list)
    confidence = np.max(prediction)
    class_id = np.argmax(prediction)
    print(f"Confidence: {confidence},ON: {class_names[class_id]}")  # Debugging output
    if confidence < 0.80:
        return "Unknown"
    else:
        return class_names[class_id]  # Return the label of the top prediction

@app.route('/classify', methods=['POST'])
def classify():
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400
    
    file = request.files['image']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if file:
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)

        try:
            processed_image = process_image(filepath)
            result = classify_image(processed_image, class_names)
            return jsonify({'class': result})
        except Exception as e:
            return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
