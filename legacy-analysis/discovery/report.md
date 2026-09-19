# Spec Extraction Discovery Report: Petstore 1.3.2

**Stage:** SX-0001 Discovery  
**Date:** 2026-09-19  
**Application:** Sun Petstore 1.3.2 (J2EE Reference Implementation)

## Executive Summary

The Petstore 1.3.2 application is a J2EE reference architecture demonstrating best practices for enterprise e-commerce. It comprises **4 web applications** (apps) and **18 reusable components**, totaling approximately **56,000 lines of code** across Java, JSP, and XML configuration.

The application exhibits a **3-tier architecture**:

- **Web Tier (JSP/Servlets):** 4 applications handling user interaction
- **Business Tier (EJB):** Component services for business logic
- **Data Tier (Cloudscape/Oracle):** Persistent storage across 3 databases

Risk concentration is high in the core shopping application and order processing workflows.

## Module Inventory

### Applications (User-Facing)

| Module       | LOC    | Screens | Risk | Purpose                                                         |
| ------------ | ------ | ------- | ---- | --------------------------------------------------------------- |
| **petstore** | 14,241 | 67      | HIGH | Primary shopping portal; core e-commerce functionality          |
| **admin**    | 5,012  | 4       | HIGH | Administrative operations and system management                 |
| **opc**      | 3,174  | 1       | HIGH | Order Processing Center; approval workflows and status tracking |
| **supplier** | 2,793  | 7       | HIGH | Supplier portal; order fulfillment and PO management            |

### Component Library (22 modules)

**High-Risk Components (critical to 1+ apps):**

- `components/catalog` (2,521 LOC) - Product catalog queries and management
- `components/purchaseorder` (949 LOC) - PO creation, line items, fulfillment
- `components/processmanager` (785 LOC) - Order workflow state machine
- `components/xmldocuments` (1,932 LOC) - XML generation and serialization

**Medium-Risk Components (supporting services):**

- `components/signon` (1,047 LOC) - Authentication and session management
- `components/customer` (724 LOC) - Customer profiles and preferences
- `components/supplierpo` (759 LOC) - Supplier-specific purchase orders
- `components/contactinfo` (498 LOC) - Address and contact data
- `components/lineitem` (477 LOC) - Order line item management
- `components/cart` (494 LOC) - Shopping cart session state
- `components/mailer` (593 LOC) - Email notifications
- `components/creditcard` (368 LOC) - Card validation and processing
- `components/address` (438 LOC) - Address entity management

**Low-Risk Components (utilities/infrastructure):**

- `components/servicelocator` (658 LOC) - JNDI service locator pattern
- `components/asyncsender` (263 LOC) - Asynchronous JMS messaging
- `components/uidgen` (360 LOC) - Unique ID generation
- `components/util` (80 LOC) - Utility functions
- `components/encodingfilter` (80 LOC) - HTTP encoding filter

## Architecture Overview

### Technology Stack

- **Language:** Java (strict J2EE 1.3 compliance)
- **Presentation:** JSP 1.2, custom template servlet framework (WAF)
- **Business Logic:** Stateless/Stateful Session EJBs, Entity EJBs
- **Data Access:** CMP (Container-Managed Persistence), JDBC for catalog reads
- **Database:** Cloudscape (embedded) or Oracle (production)
- **Integration:** JMS queues for async order processing and notifications
- **Frameworks:** Ant build system, custom WAF (Web Application Framework)

### Dependency Structure

**Critical Path:**

```
apps/petstore
  ├─> cart
  ├─> catalog
  ├─> purchaseorder
  ├─> customer → contactinfo → address
  ├─> creditcard
  ├─> signon
  └─> xmldocuments (11 dependencies feed into this)
```

**Bottleneck Modules** (high fan-in):

- `xmldocuments` (used by 11 modules) - Serialization dependency
- `servicelocator` (used by 8 modules) - EJB lookup dependency
- `contactinfo` (used by 5 modules) - Address data dependency

**Independent Components** (no outbound dependencies):

- `processmanager` - Order workflow state machine
- `signon` - Authentication service
- `uidgen` - ID generation

### Data Model

**Three Separate Databases:**

1. **petstore_db** - Catalog, customers, accounts, addresses, contact info, credit cards
2. **supplier_db** - Supplier-specific purchase orders
3. **opc_db** - Order Processing Center state and workflow

**Key Entities** (from CMP configuration):

- Customer, Account, Profile, ContactInfo
- Product (Catalog)
- ShoppingCart (session-scoped)
- Order, LineItem, PurchaseOrder
- CreditCard
- User (authentication)

### Integration Points

**JMS Queues** (Order Processing):

- `jms/opc/OrderApprovalQueue` - Orders requiring approval
- `jms/opc/MailOrderApprovalQueue` - Approval notifications
- `jms/opc/MailCompletedOrderQueue` - Order completion notifications
- `jms/opc/MailQueue` - General mail queue

**Web Services/Remoting:**

- RMI for remote EJB calls (supplier app connects to main app)
- XML document exchange format for data serialization

## Risk Assessment

### High-Risk Modules

**apps/petstore (Score: 10)**

- 67 JSP screens (largest UI surface)
- 14,241 LOC with dependencies on 14 other modules
- Implements core shopping workflow: browse → search → select → cart → checkout
- Contains business logic for product filtering, pricing, cart calculations
- **Implications for extraction:** Numerous features to specify, high coupling to component layer

**apps/admin (Score: 8)**

- Administrative console with 4 screens
- Triggers operations on `apps/opc` and other services
- Limited scope but critical for system operation
- **Implications:** Few requirements but they may be authorization/workflow-related

**apps/opc (Score: 8)**

- Order Processing Center; order approval workflow
- 1 JSP but complex state machine (processmanager dependency)
- Receives orders from petstore, coordinates supplier fulfillment
- Integrates email notifications and async processing
- **Implications:** Order approval thresholds, workflow states, approval rules are here

**apps/supplier (Score: 7)**

- Supplier portal; 7 JSP screens
- Focused on PO fulfillment and order status
- Less complex than main petstore but critical for fulfillment operations

### Medium-Risk Components

**Workflow & Business Rules:**

- `processmanager` - Order state machine; likely contains approval workflows
- `purchaseorder` - PO generation; rounding, ordering, surcharge logic
- `catalog` - Product filtering, search, pricing (Fast Lane JDBC pattern used)

**Data Management:**

- `customer` - Account activation, profile updates
- `creditcard` - Card acceptance rules, validation
- `contactinfo`, `address` - Data constraints, validation rules

## Dependency Graph Analysis

### Fan-Out (Modules with Many Dependencies)

1. `apps/petstore` → 14 modules (high coupling)
2. `apps/opc` → 8 modules (order processing needs many services)
3. `components/purchaseorder` → 6 modules (complex PO logic)

### Fan-In (Modules Depended Upon by Many)

1. `xmldocuments` ← 11 modules (serialization bottleneck)
2. `servicelocator` ← 8 modules (EJB lookup bottleneck)
3. `contactinfo` ← 5 modules (address data bottleneck)

### Extraction Ordering Implication

Independent modules (`processmanager`, `signon`) should extract first.  
Components with only internal dependencies can follow.  
`apps/petstore` should extract last due to wide fan-out.

## Known Constraints & Notes

### Framework Patterns Observed

1. **Fast Lane Reader Pattern** - Catalog reads directly via JDBC in web tier (bypasses EJB layer for performance)
2. **Value Object Pattern** - XML documents used for data transfer between tiers
3. **Service Locator Pattern** - Custom JNDI lookup utility
4. **Session Facade Pattern** - `ShoppingClientFacade` and `ShoppingController` EJBs

### Configuration Redaction

Web.xml contains redacted Java class names for:

- `param/CatalogDAODatabase` (driver name)
- `param/CatalogDAOClass` (DAO implementation)
- `param/ComponentManager` (dependency injection container)
- `param/WebController` (request dispatcher)

These appear to be strategy pattern implementations where the class is configurable at deploy time.

### Browser Support

Localization configured for: `en_US`, `ja_JP`, `zh_CN`

### Session Timeout

15 minutes (configured in web.xml)

## Exclusion Summary

**No modules are excluded from extraction.**

All 22 modules are in-scope because:

- All carry business logic or infrastructure necessary to the application
- Even utilities (`encodingfilter`, `util`, `uidgen`) are deployed and required
- No modules are marked dead code or superseded

However, extraction priority will follow the risk scoring. The WAF (Web Application Framework) is shared infrastructure; its extraction may be deferred if it is stable and unchanged.

## Capabilities Vocabulary

11 capability areas identified:

1. `catalog-search` - Product browsing and search
2. `shopping-cart` - Cart management
3. `customer-account` - User registration and profiles
4. `order-creation` - Order placement and assembly
5. `order-approval` - Order workflow and approval thresholds
6. `order-fulfillment` - Supplier coordination and fulfillment
7. `payment-processing` - Credit card validation and payment
8. `customer-contact` - Address and contact information
9. `notifications` - Email notifications and async messaging
10. `supplier-portal` - Supplier-specific operations
11. `admin-operations` - Administrative functions

Each capability is mapped to one or more modules for targeted extraction.

## Next Steps

**Stage Discovery is complete.** Ready for:

1. **Pass 1 Extraction** - Identify requirements by module
2. **Dependency Resolution** - Build OpenSpec graph with cross-module constraints
3. **Pass 2 Validation** - Verify consistency and coverage
4. **Specification Authoring** - Produce OpenSpec documents per capability

---

_SX-0001 stage complete: 22 modules surveyed, dependency graph built, risk-ranked, 11 capabilities defined._
