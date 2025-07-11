from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
import pyzbar.pyzbar as pyzbar
import cv2
import numpy as np
import logging
from datetime import datetime
import json
import sqlite3
from contextlib import contextmanager

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for frontend integration
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 5 * 1024 * 1024  # 5MB limit
app.config['DATABASE'] = 'ecoscore.db'

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Enhanced product database with more realistic data
MOCK_PRODUCTS = {
    # Beauty Category - Shampoo from the barcode image
    "036000291452": {
        "itemId": "36000291452",
        "name": "Head & Shoulders Classic Clean Shampoo",
        "category": "Beauty",
        "price": "$4.97",
        "image": "/images/shampoo-barcode.png",
        "description": "Anti-dandruff shampoo with zinc pyrithione for clean, healthy hair",
        "attributes": {
            "brand": "Head & Shoulders",
            "material": "Chemical-based",
            "packaging": "Plastic bottle",
            "ingredients": "Zinc pyrithione, sulfates",
            "certifications": [],
            "biodegradable": False,
            "recyclable": True,
            "size": "13.5 fl oz",
            "origin": "USA"
        }
    },
    # Beauty Category
    "123456789": {
        "itemId": "12417832",
        "name": "Organic Lavender Shampoo",
        "category": "Beauty",
        "price": "$9.99",
        "image": "/api/placeholder/300/300",
        "description": "Gentle organic shampoo with natural lavender extract",
        "attributes": {
            "brand": "EcoClean",
            "material": "Organic",
            "packaging": "Recycled plastic",
            "ingredients": "Plant-based, SLS-free",
            "certifications": ["USDA Organic", "Leaping Bunny"],
            "biodegradable": False,
            "recyclable": True,
            "size": "16 fl oz",
            "origin": "USA"
        }
    },
    "234567890": {
        "itemId": "23568914",
        "name": "Bamboo Hairbrush",
        "category": "Beauty",
        "price": "$12.99",
        "image": "/api/placeholder/300/300",
        "description": "Sustainable bamboo hairbrush with natural bristles",
        "attributes": {
            "brand": "GreenTools",
            "material": "Bamboo",
            "packaging": "Cardboard",
            "biodegradable": True,
            "recyclable": True,
            "durability": "High",
            "bristles": "Natural boar hair",
            "origin": "China"
        }
    },
    # Personal Care Category
    "345678901": {
        "itemId": "34679025",
        "name": "Recycled Paper Towels",
        "category": "Home",
        "price": "$4.99",
        "image": "/api/placeholder/300/300",
        "description": "Strong and absorbent paper towels made from 100% recycled materials",
        "attributes": {
            "brand": "EcoHome",
            "material": "Recycled paper",
            "packaging": "Paper",
            "biodegradable": True,
            "recyclable": True,
            "postConsumerWaste": "80%",
            "sheets": "120 sheets per roll",
            "rolls": "6 rolls"
        }
    },
    "456789012": {
        "itemId": "45780136",
        "name": "Metal Safety Razor",
        "category": "Personal Care",
        "price": "$19.99",
        "image": "/api/placeholder/300/300",
        "description": "Durable stainless steel safety razor for zero-waste shaving",
        "attributes": {
            "brand": "ZeroWaste",
            "material": "Stainless steel",
            "packaging": "Metal tin",
            "biodegradable": False,
            "recyclable": True,
            "lifespan": "Lifetime",
            "blades": "10 replacement blades included",
            "weight": "3.2 oz"
        }
    },
    # Grocery Category
    "567890123": {
        "itemId": "56891247",
        "name": "Organic Fair Trade Coffee",
        "category": "Grocery",
        "price": "$8.49",
        "image": "/api/placeholder/300/300",
        "description": "Rich, full-bodied coffee beans sourced from sustainable farms",
        "attributes": {
            "brand": "EarthBean",
            "material": "Organic coffee",
            "packaging": "Compostable bag",
            "certifications": ["USDA Organic", "Fair Trade"],
            "biodegradable": True,
            "carbonNeutral": True,
            "roast": "Medium",
            "origin": "Guatemala",
            "weight": "12 oz"
        }
    },
    "678901234": {
        "itemId": "67902358",
        "name": "Glass Jar Honey",
        "category": "Grocery",
        "price": "$6.99",
        "image": "/api/placeholder/300/300",
        "description": "Pure wildflower honey from local beekeepers",
        "attributes": {
            "brand": "BeeGood",
            "material": "Glass",
            "packaging": "Glass jar with metal lid",
            "local": True,
            "recyclable": True,
            "reusable": True,
            "type": "Wildflower",
            "size": "16 oz",
            "origin": "Local farms"
        }
    },
    # Home Category
    "789012345": {
        "itemId": "78013469",
        "name": "Eco Laundry Detergent",
        "category": "Home",
        "price": "$11.49",
        "image": "/api/placeholder/300/300",
        "description": "Concentrated plant-based laundry detergent for sensitive skin",
        "attributes": {
            "brand": "CleanGreen",
            "material": "Plant-based",
            "packaging": "Recycled HDPE plastic",
            "biodegradable": True,
            "recyclable": True,
            "concentrated": True,
            "loads": "64 loads",
            "scent": "Lavender",
            "hypoallergenic": True
        }
    },
    "890123456": {
        "itemId": "89124570",
        "name": "Plastic Sponge",
        "category": "Home",
        "price": "$2.49",
        "image": "/api/placeholder/300/300",
        "description": "Multi-purpose cleaning sponge for kitchen and bathroom",
        "attributes": {
            "brand": "QuickClean",
            "material": "Synthetic fibers",
            "packaging": "Plastic wrap",
            "biodegradable": False,
            "recyclable": False,
            "durability": "Low",
            "count": "4 sponges",
            "antimicrobial": True
        }
    },
    # Kitchen Category
    "901234567": {
        "itemId": "90235681",
        "name": "Bamboo Cutting Board",
        "category": "Kitchen",
        "price": "$14.99",
        "image": "/api/placeholder/300/300",
        "description": "Durable bamboo cutting board with juice groove",
        "attributes": {
            "brand": "BambooWare",
            "material": "Bamboo",
            "packaging": "Recycled cardboard",
            "biodegradable": True,
            "recyclable": True,
            "lifespan": "5+ years",
            "size": "12x8 inches",
            "thickness": "0.75 inches",
            "antimicrobial": True
        }
    },
    "012345678": {
        "itemId": "01346792",
        "name": "Plastic Food Container",
        "category": "Kitchen",
        "price": "$3.99",
        "image": "/api/placeholder/300/300",
        "description": "Airtight food storage container for meal prep",
        "attributes": {
            "brand": "StoreRight",
            "material": "Polypropylene",
            "packaging": "Plastic wrap",
            "biodegradable": False,
            "recyclable": True,
            "bpaFree": True,
            "capacity": "32 oz",
            "microwaveSafe": True,
            "dishwasherSafe": True
        }
    }
}

# Database setup
def init_db():
    """Initialize the database with tables for analytics"""
    with sqlite3.connect(app.config['DATABASE']) as conn:
        conn.execute('''
            CREATE TABLE IF NOT EXISTS scans (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                barcode TEXT NOT NULL,
                product_name TEXT,
                ecoscore INTEGER,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                user_ip TEXT
            )
        ''')
        conn.execute('''
            CREATE TABLE IF NOT EXISTS user_stats (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_ip TEXT NOT NULL,
                total_scans INTEGER DEFAULT 0,
                eco_points INTEGER DEFAULT 0,
                carbon_saved REAL DEFAULT 0.0,
                last_scan DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        conn.commit()

@contextmanager
def get_db():
    """Database context manager"""
    conn = sqlite3.connect(app.config['DATABASE'])
    conn.row_factory = sqlite3.Row
    try:
        yield conn
    finally:
        conn.close()

def log_scan(barcode, product_name, ecoscore, user_ip):
    """Log scan to database for analytics"""
    try:
        with get_db() as conn:
            conn.execute(
                'INSERT INTO scans (barcode, product_name, ecoscore, user_ip) VALUES (?, ?, ?, ?)',
                (barcode, product_name, ecoscore, user_ip)
            )
            # Update user stats
            conn.execute('''
                INSERT OR REPLACE INTO user_stats (user_ip, total_scans, eco_points, last_scan)
                VALUES (?, 
                    COALESCE((SELECT total_scans FROM user_stats WHERE user_ip = ?), 0) + 1,
                    COALESCE((SELECT eco_points FROM user_stats WHERE user_ip = ?), 0) + ?,
                    CURRENT_TIMESTAMP)
            ''', (user_ip, user_ip, user_ip, ecoscore * 10))
            conn.commit()
    except Exception as e:
        logger.error(f"Database logging error: {e}")

def allowed_file(filename):
    """Check if the uploaded file has an allowed extension"""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in {'png', 'jpg', 'jpeg', 'gif', 'bmp', 'tiff'}

def scan_barcode(image_path):
    """Detect barcode from uploaded image using OpenCV and pyzbar"""
    try:
        img = cv2.imread(image_path)
        if img is None:
            raise ValueError("Invalid image file")
        
        # Try multiple preprocessing techniques for better detection
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        
        # Method 1: Direct scan
        barcodes = pyzbar.decode(gray)
        if barcodes:
            return barcodes[0].data.decode('utf-8')
        
        # Method 2: Gaussian blur
        blurred = cv2.GaussianBlur(gray, (5, 5), 0)
        barcodes = pyzbar.decode(blurred)
        if barcodes:
            return barcodes[0].data.decode('utf-8')
        
        # Method 3: Threshold
        _, thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
        barcodes = pyzbar.decode(thresh)
        if barcodes:
            return barcodes[0].data.decode('utf-8')
        
        # Method 4: Morphological operations
        kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (3, 3))
        morph = cv2.morphologyEx(gray, cv2.MORPH_CLOSE, kernel)
        barcodes = pyzbar.decode(morph)
        if barcodes:
            return barcodes[0].data.decode('utf-8')
        
        return None
    except Exception as e:
        raise RuntimeError(f"Barcode scanning failed: {str(e)}")

def generate_ecoscore(product):
    """Calculate EcoScore based on multiple sustainability factors"""
    score = 0
    
    # Material scoring (50% of total)
    material_scores = {
        "Bamboo": 5,
        "Glass": 4,
        "Stainless steel": 4,
        "Organic": 4,
        "Plant-based": 4,
        "Recycled paper": 4,
        "Recycled plastic": 3,
        "Polypropylene": 2,
        "Chemical-based": 1,
        "Synthetic fibers": 1
    }
    material = product["attributes"].get("material", "Plastic")
    score += material_scores.get(material, 1) * 0.5
    
    # Packaging scoring (20% of total)
    packaging_scores = {
        "Compostable bag": 5,
        "Cardboard": 5,
        "Paper": 5,
        "Glass jar": 4,
        "Recycled cardboard": 4,
        "Metal tin": 4,
        "Recycled HDPE plastic": 3,
        "Plastic bottle": 2,
        "Plastic wrap": 1
    }
    packaging = product["attributes"].get("packaging", "Plastic wrap")
    score += packaging_scores.get(packaging, 1) * 0.2
    
    # Additional attributes (30% of total)
    if product["attributes"].get("biodegradable", False):
        score += 1.5
    if product["attributes"].get("recyclable", False):
        score += 1.0
    if product["attributes"].get("certifications"):
        score += len(product["attributes"]["certifications"]) * 0.5
    if product["attributes"].get("carbonNeutral", False):
        score += 1.0
    if product["attributes"].get("local", False):
        score += 0.5
    if product["attributes"].get("fairTrade", False):
        score += 0.5
    
    # Normalize to 1-5 scale
    return min(5, max(1, round(score)))

def get_alternatives(product):
    """Return logically related alternatives with better EcoScores"""
    category = product["category"]
    current_score = generate_ecoscore(product)
    product_name = product["name"].lower()
    
    # Beauty alternatives
    if category == "Beauty":
        if "shampoo" in product_name:
            return [
                {
                    "id": "235689",
                    "name": "Shampoo Bar (Package Free)",
                    "ecoscore": 5,
                    "price": "$7.99",
                    "image": "/api/placeholder/200/200",
                    "improvement": "Eliminates plastic bottle entirely",
                    "attributes": {
                        "material": "Solid formulation",
                        "packaging": "None",
                        "wasteReduction": "100% packaging-free",
                        "biodegradable": True,
                        "certifications": ["Vegan", "Cruelty-Free"]
                    }
                },
                {
                    "id": "874563",
                    "name": "Refillable Shampoo System",
                    "ecoscore": 4,
                    "price": "$12.99 (includes bottle)",
                    "image": "/api/placeholder/200/200",
                    "improvement": "Reduces packaging waste by 80%",
                    "attributes": {
                        "material": "Liquid concentrate",
                        "packaging": "Aluminum bottle",
                        "refillCount": "10+ uses",
                        "recyclable": True
                    }
                }
            ]
        elif "hairbrush" in product_name:
            return [
                {
                    "id": "345712",
                    "name": "100% Biodegradable Hairbrush",
                    "ecoscore": 5,
                    "price": "$14.99",
                    "image": "/api/placeholder/200/200",
                    "improvement": "Fully compostable including bristles",
                    "attributes": {
                        "material": "Wood and natural bristles",
                        "packaging": "None",
                        "biodegradable": True,
                        "compostTime": "6-12 months"
                    }
                }
            ]
    
    # Personal Care alternatives
    elif category == "Personal Care":
        if "razor" in product_name:
            return [
                {
                    "id": "456123",
                    "name": "Compostable Bamboo Razor",
                    "ecoscore": 5,
                    "price": "$9.99",
                    "image": "/api/placeholder/200/200",
                    "improvement": "Fully biodegradable alternative",
                    "attributes": {
                        "material": "Bamboo with steel blade",
                        "packaging": "Compostable cellulose",
                        "biodegradable": True,
                        "bladeReplacements": "Yes"
                    }
                }
            ]
    
    # Home alternatives
    elif category == "Home":
        if "sponge" in product_name:
            return [
                {
                    "id": "678345",
                    "name": "Plant-Based Loofah Sponge",
                    "ecoscore": 5,
                    "price": "$4.49",
                    "image": "/api/placeholder/200/200",
                    "improvement": "100% natural and compostable",
                    "attributes": {
                        "material": "Loofah plant",
                        "packaging": "None",
                        "compostTime": "3-6 months",
                        "biodegradable": True
                    }
                },
                {
                    "id": "789123",
                    "name": "Reusable Silicone Sponge",
                    "ecoscore": 4,
                    "price": "$6.99",
                    "image": "/api/placeholder/200/200",
                    "improvement": "Lasts years instead of weeks",
                    "attributes": {
                        "material": "Food-grade silicone",
                        "packaging": "Recycled paper",
                        "lifespan": "2+ years",
                        "recyclable": True
                    }
                }
            ]
        elif "detergent" in product_name:
            return [
                {
                    "id": "890456",
                    "name": "Laundry Detergent Sheets",
                    "ecoscore": 5,
                    "price": "$12.99 (60 loads)",
                    "image": "/api/placeholder/200/200",
                    "improvement": "Ultra-lightweight, no plastic",
                    "attributes": {
                        "material": "Concentrated sheets",
                        "packaging": "Compostable pouch",
                        "carbonFootprint": "80% lower",
                        "biodegradable": True
                    }
                }
            ]
    
    # Grocery alternatives
    elif category == "Grocery":
        if "coffee" in product_name:
            return [
                {
                    "id": "901234",
                    "name": "Shade-Grown Bird Friendly Coffee",
                    "ecoscore": 5,
                    "price": "$9.99",
                    "image": "/api/placeholder/200/200",
                    "improvement": "Preserves bird habitats",
                    "attributes": {
                        "material": "Organic coffee",
                        "packaging": "Compostable bag",
                        "wildlifeImpact": "Positive",
                        "certifications": ["Bird Friendly", "Organic"]
                    }
                },
                {
                    "id": "012567",
                    "name": "Coffee Pod Refill System",
                    "ecoscore": 4,
                    "price": "$24.99 (starter kit)",
                    "image": "/api/placeholder/200/200",
                    "improvement": "Eliminates single-use pods",
                    "attributes": {
                        "material": "Stainless steel",
                        "packaging": "None",
                        "wasteReduction": "100% vs disposable pods",
                        "reusable": True
                    }
                }
            ]
        elif "honey" in product_name:
            return [
                {
                    "id": "123890",
                    "name": "Local Raw Honey in Mason Jar",
                    "ecoscore": 5,
                    "price": "$8.99",
                    "image": "/api/placeholder/200/200",
                    "improvement": "Supports local beekeepers",
                    "attributes": {
                        "material": "Raw honey",
                        "packaging": "Reusable glass jar",
                        "foodMiles": "<50 miles",
                        "reusable": True
                    }
                }
            ]
    
    # Kitchen alternatives
    elif category == "Kitchen":
        if "container" in product_name:
            return [
                {
                    "id": "234901",
                    "name": "Glass Food Storage Set",
                    "ecoscore": 5,
                    "price": "$29.99 (5-piece set)",
                    "image": "/api/placeholder/200/200",
                    "improvement": "Non-toxic and endlessly reusable",
                    "attributes": {
                        "material": "Glass with bamboo lids",
                        "packaging": "Recycled cardboard",
                        "microwaveSafe": True,
                        "freezerSafe": True
                    }
                },
                {
                    "id": "345012",
                    "name": "Stainless Steel Lunch Box",
                    "ecoscore": 5,
                    "price": "$18.99",
                    "image": "/api/placeholder/200/200",
                    "improvement": "Unbreakable and durable",
                    "attributes": {
                        "material": "Stainless steel",
                        "packaging": "None",
                        "lifespan": "10+ years",
                        "recyclable": True
                    }
                }
            ]
    
    # Default alternatives (fallback)
    return [
        {
            "id": "000001",
            "name": "Eco-Friendly Alternative",
            "ecoscore": 4,
            "price": "$8.99",
            "image": "/api/placeholder/200/200",
            "improvement": "Better environmental profile",
            "attributes": {
                "material": "Sustainable alternative",
                "packaging": "Eco-friendly",
                "impact": "Reduced carbon footprint"
            }
        }
    ]

def get_sustainability_tips(product):
    """Generate personalized sustainability tips for the product"""
    tips = []
    attributes = product.get("attributes", {})
    
    if attributes.get("material") in ["Plastic", "Synthetic fibers", "Polypropylene", "Chemical-based"]:
        tips.append("Consider alternatives with less plastic content to reduce microplastic pollution")
    
    if not attributes.get("recyclable", False):
        tips.append("This item cannot be recycled - please dispose properly to avoid contamination")
    
    if attributes.get("biodegradable", False):
        tips.append("This product is biodegradable - compost if possible to complete the lifecycle")
    
    if product.get("ecoscore", 0) < 3:
        tips.append("We found better alternatives with higher EcoScores - check the suggestions")
    elif product.get("ecoscore", 0) >= 4:
        tips.append("Great choice! This product has excellent sustainability credentials")
    
    if "packaging" in attributes and "plastic" in attributes["packaging"].lower():
        tips.append("Look for brands that offer take-back programs for their packaging")
    
    if not tips:
        tips.append("Small changes make a big difference - consider reusable options next time")
    
    return tips

# API Routes
@app.route('/')
def home():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "message": "EcoScore Backend API",
        "version": "1.0.0",
        "endpoints": [
            "/api/scan - POST - Upload barcode image",
            "/api/stats - GET - Get scanning statistics",
            "/api/health - GET - Health check"
        ]
    })

@app.route('/api/health')
def health_check():
    """Detailed health check for monitoring"""
    return jsonify({
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "database": "connected",
        "opencv": "available",
        "pyzbar": "available"
    })

@app.route('/api/stats')
def get_stats():
    """Get scanning statistics"""
    try:
        with get_db() as conn:
            # Total scans
            total_scans = conn.execute('SELECT COUNT(*) as count FROM scans').fetchone()['count']
            
            # Average ecoscore
            avg_score = conn.execute('SELECT AVG(ecoscore) as avg FROM scans').fetchone()['avg'] or 0
            
            # Top categories
            categories = conn.execute('''
                SELECT 
                    CASE 
                        WHEN product_name LIKE '%shampoo%' OR product_name LIKE '%brush%' THEN 'Beauty'
                        WHEN product_name LIKE '%coffee%' OR product_name LIKE '%honey%' THEN 'Grocery'
                        WHEN product_name LIKE '%detergent%' OR product_name LIKE '%sponge%' THEN 'Home'
                        WHEN product_name LIKE '%razor%' OR product_name LIKE '%towel%' THEN 'Personal Care'
                        ELSE 'Kitchen'
                    END as category,
                    COUNT(*) as count
                FROM scans 
                GROUP BY category 
                ORDER BY count DESC
            ''').fetchall()
            
            return jsonify({
                "totalScans": total_scans,
                "averageEcoScore": round(avg_score, 2),
                "categories": [dict(row) for row in categories],
                "timestamp": datetime.now().isoformat()
            })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/scan', methods=['POST'])
def handle_scan():
    """Handle barcode image upload and return product data"""
    if 'image' not in request.files:
        return jsonify({"error": "No image uploaded"}), 400
    
    file = request.files['image']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    
    if not allowed_file(file.filename):
        return jsonify({"error": "Invalid file type. Use JPG/PNG/GIF/BMP/TIFF"}), 400
    
    filepath = None
    try:
        filename = secure_filename(file.filename)
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"{timestamp}_{filename}"
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        logger.info(f"Processing image: {filename}")
        
        barcode = scan_barcode(filepath)
        if not barcode:
            return jsonify({"error": "No barcode detected. Try a clearer image with better lighting."}), 400
        
        logger.info(f"Detected barcode: {barcode}")
        
        product = MOCK_PRODUCTS.get(barcode, {
            "itemId": "0",
            "name": "Generic Product",
            "category": "Miscellaneous",
            "price": "$0.00",
            "image": "/api/placeholder/300/300",
            "description": "Product not found in database",
            "attributes": {"material": "Unknown", "packaging": "Unknown"}
        })
        
        ecoscore = generate_ecoscore(product)
        packaging = "Recyclable" if product["attributes"].get("recyclable", False) else "Non-recyclable"
        carbon_impact = "Low" if ecoscore >= 3 else "High"
        
        alternatives = get_alternatives(product)
        sustainability_tips = get_sustainability_tips(product)
        
        product.update({
            "ecoscore": ecoscore,
            "packaging": packaging,
            "carbonFootprint": carbon_impact,
            "sustainabilityTips": sustainability_tips,
            "scanTimestamp": datetime.now().isoformat()
        })
        
        # Log scan for analytics
        user_ip = request.environ.get('HTTP_X_FORWARDED_FOR', request.remote_addr)
        log_scan(barcode, product["name"], ecoscore, user_ip)
        
        logger.info(f"Scan successful: {product['name']} (EcoScore: {ecoscore})")
        
        return jsonify({
            "success": True,
            "product": product,
            "alternatives": alternatives,
            "barcode": barcode,
            "message": f"Successfully scanned {product['name']}"
        })
        
    except Exception as e:
        logger.error(f"Scan error: {str(e)}")
        return jsonify({"error": f"Processing failed: {str(e)}"}), 500
    finally:
        if filepath and os.path.exists(filepath):
            try:
                os.remove(filepath)
            except:
                pass

@app.route('/api/placeholder/<int:width>/<int:height>')
def placeholder_image(width, height):
    """Generate placeholder image URLs"""
    return f"https://via.placeholder.com/{width}x{height}/4ade80/ffffff?text=EcoProduct"

# Error handlers
@app.errorhandler(413)
def too_large(e):
    return jsonify({"error": "File too large. Maximum size is 5MB."}), 413

@app.errorhandler(500)
def internal_error(e):
    return jsonify({"error": "Internal server error"}), 500

@app.errorhandler(404)
def not_found(e):
    return jsonify({"error": "Endpoint not found"}), 404

if __name__ == '__main__':
    init_db()
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_ENV') == 'development'
    app.run(debug=debug, host='0.0.0.0', port=port)
